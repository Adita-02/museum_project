import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();


const ADMIN_NAME = "AFW";
const ADMIN_EMAIL = "aw@gmail.com";
const ADMIN_PASSWORD = "2AFW69";


mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      existing.isAdmin = true;
      existing.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await existing.save();
      console.log("✅ Existing user updated to admin:", ADMIN_EMAIL);
    } else {
      const hashPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashPassword,
        isAdmin: true,
      });
      console.log("✅ Admin user created:", ADMIN_EMAIL);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    process.exit();
  }
});