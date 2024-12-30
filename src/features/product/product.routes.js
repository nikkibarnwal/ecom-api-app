import express from "express";
import ProductController from "./product.controller.js";
import productValidationRuqest from "../../middlewares/productValidateRequest.middleware.js";
import uploadFile from "../../middlewares/fileUpload.middleware.js";

// Initilize express router
const productRouter = express.Router();

const productController = new ProductController();

// initilize all product controller methods
// localhost/api/products

productRouter.get("/", productController.getAllProducts);
productRouter.post(
  "/",
  uploadFile.single("imageUrl"), //file name
  productValidationRuqest,
  productController.addProduct
);

productRouter.get("/filter", productController.getFilterData);
productRouter.get("/:id", productController.getOneProduct);

productRouter.post("/rate", productController.rateProduct);

export default productRouter;
