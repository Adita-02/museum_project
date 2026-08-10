import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Signup User
export const signupUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashPassword
        });
        res.json({ message: "User registered successfully" });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Login User
export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Update Profile (logged-in user updates their own name/email)
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ message: "Name or email lagbe update korar jonno" });
        }

        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: userId } });
            if (existing) {
                return res.status(400).json({ message: "Ei email diye onno account already ache" });
            }
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.trim();

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};