import CartModel from "./cart.model.js";

export default class CartController {
  add(req, res) {
    try {
      // this is coming from jwtAuth.middleware file
      const userId = req.jwtUserID;
      const { productId, quantity } = req.body;
      if (quantity < 1) {
        return res
          .status(400)
          .json({ message: "quantity must be greater then 0", success: false });
      }
      if (!userId || !productId || !quantity) {
        return res
          .status(400)
          .json({ message: "Missing required fields", success: false });
      }

      const cart = CartModel.add(userId, productId, quantity);
      if (cart) {
        return res.status(400).json({ message: cart, success: false });
      } else {
        return res
          .status(201)
          .json({ message: "Cart is updated", success: true });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error, success: false });
    }
  }
  getCartItemByUserId(req, res) {
    // this is coming from jwtAuth.middleware file
    const userId = req.jwtUserID;
    const cartItems = CartModel.get(userId);
    try {
      return res.status(200).json({ cart: cartItems, success: true });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error, success: false });
    }
  }
  deleteItem(req, res) {
    const userId = req.jwtUserID;
    const cartItemId = req.params.id;
    try {
      if (!userId || !cartItemId)
        return res
          .status(400)
          .json({ message: "missing required cartItemId", success: false });
      else {
        const error = CartModel.delete(cartItemId, userId);
        if (error) {
          return res.status(404).json({ message: error, success: false });
        } else {
          return res.status(200).send({
            message: "Cart item is removed successfully",
            success: true,
          });
        }
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error, success: false });
    }
  }
  clearCart() {
    const userId = req.jwtUserID;
    try {
      if (!userId)
        return res
          .status(404)
          .json({ message: "missing user details", success: false });
      else CartModel.clear(cartItemId, userId);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error, success: false });
    }
  }
}