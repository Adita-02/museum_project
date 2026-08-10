import Cart from "../models/Cart.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, artifactId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ artifactId, quantity: 1 }] });
    } else {
      const item = cart.items.find((i) => i.artifactId.toString() === artifactId);
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ artifactId, quantity: 1 });
      }
    }

    await cart.save();
    res.json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, artifactId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((i) => i.artifactId.toString() !== artifactId);

    await cart.save();
    res.json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update item quantity in cart

export const updateQuantity = async (req, res) => {
  try {
    const { userId, artifactId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.artifactId.toString() === artifactId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();
    res.json({
      message: "Item quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get cart by user ID
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.artifactId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};