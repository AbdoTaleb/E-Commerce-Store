import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const existingItem = req.user.cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.user.cart.push({ productId, quantity: 1 });
    }
    await req.user.save();
    res.status(200).json({ message: "Product added to cart", cart: req.user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    if (!productId) {
      user.cart = [];
    } else {
      req.user.cart = req.user.cart.filter((item) => item.productId !== productId);
    }
    await req.user.save();
    res.status(200).json({ message: "Products removed from cart", cart: req.user.cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // productId
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(200).json({ message: "Product removed from cart", cart: user.cartItems });
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json({ message: "Cart updated", cart: user.cartItems });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    // add quantity to each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find((item) => item.id === product._id.toString());
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
