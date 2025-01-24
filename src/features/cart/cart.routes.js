import express from "express";
import CartController from "./cart.controller.js";

const cartRouter = express.Router();
const cartController = new CartController();

cartRouter.post("/", (req, res) => cartController.add(req, res));

cartRouter.get("/", (req, res) => cartController.getCartItemByUserId(req, res));
cartRouter.get("/clear", (req, res) => cartController.clearCart(req, res));
cartRouter.delete("/:id", (req, res) => cartController.deleteItem(req, res));

/**
 * Router handling all cart-related routes.
 *
 * @module cartRouter
 */
export default cartRouter;
