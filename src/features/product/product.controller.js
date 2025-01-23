import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import ProductModel from "./product.model.js";
import ProductRespository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRespository();
  }
  async getAllProducts(req, res) {
    const products = await this.productRepository.getAll();
    if (!products) {
      return res
        .status(BAD_REQUEST_CODE)
        .send({ success: false, message: "Product not found" });
    }
    return res.status(SUCCESS_CODE).send({ success: true, products });
  }

  async addProduct(req, res) {
    const { name, desc, price, category, sizes } = req.body;
    if (!req.file) {
      return res
        .status(BAD_REQUEST_CODE)
        .send({ success: false, message: "Product image is required" });
    }
    const productObj = new ProductModel(
      name,
      desc,
      parseFloat(price),
      category,
      req.file.filename,
      sizes ? sizes.split(",") : []
    );
    const product = await this.productRepository.add(productObj);
    res.status(CREATED_CODE).send({ success: true, product });
  }

  async getOneProduct(req, res) {
    const productId = req.params.id;
    const product = await this.productRepository.get(productId);
    // const product = ProductModel.get(productId);
    if (!product) {
      return res
        .status(BAD_REQUEST_CODE)
        .send({ success: false, message: "Product not found" });
    }
    return res.status(SUCCESS_CODE).send({ success: true, product });
  }
  async getFilterData(req, res) {
    const { minPrice, maxPrice, category } = req.query;
    // const product = ProductModel.filterProduct(minPrice, maxPrice, category);
    const products = await this.productRepository.filter(
      minPrice,
      maxPrice,
      category
    );
    return res.status(SUCCESS_CODE).send({ success: true, products });
  }
  async rateProduct(req, res) {
    const userId = req.jwtUserID;
    const { productId, rating } = req.body;
    try {
      console.log("userId", userId, productId, rating);
      if (!productId || !rating) {
        throw new Error("Missing required fields");
      }
      // ProductModel.rateProduct(userId, productId, rating);
      await this.productRepository.rate(userId, productId, rating);
      return res
        .status(SUCCESS_CODE)
        .send({ success: true, message: "Rating has been done" });
    } catch (error) {
      return res
        .status(BAD_REQUEST_CODE)
        .send({ success: false, message: error.message });
    }
  }
}
