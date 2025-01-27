import express from "express";
import ProductController from "./product.controller.js";
import productValidationRuqest from "../../middlewares/productValidateRequest.middleware.js";
import uploadFile from "../../middlewares/fileUpload.middleware.js";

// Initilize express router
const productRouter = express.Router();

const productController = new ProductController();

// initilize all product controller methods
// localhost/api/products

productRouter.get("/", (req, res) =>
  productController.getAllProducts(req, res)
);
productRouter.post(
  "/",
  uploadFile.single("imageUrl"), //file name
  productValidationRuqest,
  (req, res) => productController.addProduct(req, res)
);

productRouter.get("/filter", (req, res) =>
  productController.getFilterData(req, res)
);
productRouter.get("/average/price", (req, res) =>
  productController.getAveragePrice(req, res)
);
productRouter.get("/average/rating", (req, res) =>
  productController.getAverageRating(req, res)
);
productRouter.get("/rating/count", (req, res) =>
  productController.getRatingCount(req, res)
);
productRouter.get("/:id", (req, res) =>
  productController.getOneProduct(req, res)
);

productRouter.post("/rate", (req, res) =>
  productController.rateProduct(req, res)
);

export default productRouter;
