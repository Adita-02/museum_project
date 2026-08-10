import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        artifactId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artifact",
        },
        quantity: Number,
        price: Number,
      },
    ],

    address: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
    },

    totalAmount: Number,

    paymentMethod: {
      type: String,
      default: "COD",
    },

    status: {
      type: String,
      default: "Placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);