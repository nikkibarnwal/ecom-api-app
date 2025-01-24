import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import ProductRespository from "../product/product.repository.js";
import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRespository();
  }
  async add(req, res) {
    try {
      // this is coming from jwtAuth.middleware file
      const userId = req.jwtUserID;
      const { productId, quantity } = req.body;
      if (quantity < 1) {
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "quantity must be greater then 0", success: false });
      }
      if (!productId || !quantity) {
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "Missing required fields", success: false });
      }
      // check if product exists
      const product = await this.productRepository.get(productId);
      // const product = ProductModel.get(productId);
      if (!product) {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ success: false, message: "Product not found" });
      } else {
        await this.cartRepository.createCart(userId, productId, quantity);
        // const cart = CartModel.add(userId, productId, quantity);
        return res
          .status(CREATED_CODE)
          .json({ message: "Cart is updated", success: true });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ message: "Internal server error", error, success: false });
    }
  }
  async getCartItemByUserId(req, res) {
    // this is coming from jwtAuth.middleware file
    try {
      const userId = req.jwtUserID;
      // const cartItems = CartModel.get(userId);
      const cartItems = await this.cartRepository.getCartByUserId(userId);
      return res.status(SUCCESS_CODE).json({ cart: cartItems, success: true });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ message: "Internal server error", error, success: false });
    }
  }
  async deleteItem(req, res) {
    const userId = req.jwtUserID;
    const cartItemId = req.params.id;
    try {
      if (!userId || !cartItemId)
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "missing required cartItemId", success: false });
      else {
        // const isDeleted = CartModel.delete(cartItemId, userId);

        const isDeleted = await this.cartRepository.delete(cartItemId, userId);
        if (isDeleted) {
          return res.status(SUCCESS_CODE).send({
            message: "Cart item is removed successfully",
            success: true,
          });
        } else {
          return res
            .status(NOT_FOUND_CODE)
            .json({ message: "Item not found", success: false });
        }
      }
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ message: "Internal server error", error, success: false });
    }
  }
  // clear cart for logged in user
  async clearCart(req, res) {
    const userId = req.jwtUserID;
    try {
      if (!userId)
        return res
          .status(NOT_FOUND_CODE)
          .json({ message: "missing user details", success: false });
      else {
        // CartModel.clear(cartItemId, userId);
        await this.cartRepository.clear(userId);
        return res.status(SUCCESS_CODE).send({
          message: "Cart item is cleared successfully",
          success: true,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ message: "Internal server error", success: false });
    }
  }
}
