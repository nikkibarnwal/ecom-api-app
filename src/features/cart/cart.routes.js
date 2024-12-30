import express from "express";
import CartController from "./cart.controller.js";

const cartRouter = express.Router();
const cartController = new CartController();

cartRouter.post("/", cartController.add);

cartRouter.get("/", cartController.getCartItemByUserId);
cartRouter.get("/clear", cartController.clearCart);
cartRouter.delete("/:id", cartController.deleteItem);

/**
 * Router handling all cart-related routes.
 *
 * @module cartRouter
 */
export default cartRouter;
