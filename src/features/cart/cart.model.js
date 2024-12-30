import { uid } from "../../utils/common.js";
import UserModel from "../user/user.model.js";
import ProductModel from "../product/product.model.js";

export default class CartModel {
  constructor(id, productId, userId, quantity) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.quantity = quantity;
  }
  static getCartByUserId(userId) {
    return cartItems.filter((cart) => Number(cart.userId) == Number(userId));
  }
  static add(userId, productId, quantity) {
    const user = UserModel.userById(userId);
    if (!user) {
      return "User not found";
    }
    const product = ProductModel.get(productId);
    if (!product) {
      return "Product not found";
    }
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.userId === userId && item.productId === productId
    );
    if (existingCartItemIndex == -1) {
      const cartItem = new CartModel(uid(), productId, userId, quantity);
      cartItems.push({ ...cartItem });
    } else {
      cartItems[existingCartItemIndex].quantity = quantity;
    }
  }
  static delete(cartItemId, userId) {
    const cartIndex = cartItems.findIndex(
      (cart) =>
        Number(cart.id) === Number(cartItemId) &&
        Number(cart.userId) == Number(userId)
    );
    if (cartIndex == -1) {
      return "Item not found";
    } else {
      cartItems.splice(cartIndex, 1);
    }
  }

  static get(userId) {
    const carts = this.getCartByUserId(userId);
    if (carts.length > 0) {
      carts.map((cart) => {
        cart["product"] = ProductModel.get(cart.productId);
        return cart;
      });
      return carts;
    }
    return carts;
  }
  static clear(userId) {
    cartItems = cartItems.filter(
      (cart) => Number(cart.userId) !== Number(userId)
    );
    return "Cart cleared";
  }
}

const cartItems = [new CartModel(1, 2, 1, 1), new CartModel(2, 2, 2, 3)];
