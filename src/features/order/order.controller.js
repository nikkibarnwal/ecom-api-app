import { CREATED_CODE, SUCCESS_CODE } from "../../config/statusCode.js";
import OrderRepository from "./order.repository.js";

class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }
  async createOrder(req, res, next) {
    try {
      const userId = req.jwtUserID;
      //   console.log("userId", userId);
      const order = await this.orderRepository.placeOrder(userId);
      res
        .status(CREATED_CODE)
        .json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
      // it will handle the error and send the response to the client from error handler middleware, error.middleware.js
      next(error);
    }
  }
  async getOrders(req, res) {
    try {
      const orders = await this.orderRepository.getOrders();
      res.status(SUCCESS_CODE).json({ success: true, orders });
    } catch (error) {
      // it will handle the error and send the response to the client from error handler middleware, error.middleware.js
      next(error);
    }
  }
}

export default OrderController;
