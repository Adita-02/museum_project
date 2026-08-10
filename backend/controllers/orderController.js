import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Artifact from '../models/artifact.js';

export const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;

        const cart = await Cart.findOne({ userId }).populate('items.artifactId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = cart.items.map(item => ({
            artifactId: item.artifactId._id,
            quantity: item.quantity,
            price: item.artifactId.price,
        }));

        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        for (let item of cart.items) {
            await Artifact.findByIdAndUpdate(item.artifactId._id, { $inc: { stock: -item.quantity } });
        }

        const order = await Order.create({
            userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod: "COD",
        });

        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.status(201).json({ message: "Order placed successfully", orderId: order._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/orders — admin panel-এর জন্য সব order, frontend-friendly shape-এ
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.artifactId', 'title')
            .sort({ createdAt: -1 });

        const shaped = orders.map(o => ({
            _id: o._id,
            customerName: o.userId?.name || o.address?.fullName || "Guest",
            total: o.totalAmount,
            status: o.status,
            createdAt: o.createdAt,
            items: o.items.map(i => ({
                name: i.artifactId?.title || "Removed item",
                quantity: i.quantity,
                price: i.price,
            })),
        }));

        res.json(shaped);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};