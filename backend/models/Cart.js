import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
  {
    artifactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artifact",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
]
});

export default mongoose.model('Cart', CartSchema);