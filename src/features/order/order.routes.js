import { Router } from "express";
import OrderController from "./order.controller.js";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.get("/", (req, res, next) =>
  orderController.getOrders(req, res, next)
);
orderRouter.post("/", (req, res, next) =>
  orderController.createOrder(req, res, next)
);

export default orderRouter;
