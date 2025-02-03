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
  /**
   * Retrieves all products from the repository and sends them in the response.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getAllProducts(req, res) {
    const products = await this.productRepository.getAll();
    if (!products) {
      return res
        .status(BAD_REQUEST_CODE)
        .send({ success: false, message: "Product not found" });
    }
    return res.status(SUCCESS_CODE).send({ success: true, products });
  }

  /**
   * Adds a new product.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
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

  /**
   * Retrieves a single product by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async getOneProduct(req, res) {
    const productId = req.params.id;
    const product = await this.productRepository.get(productId);
    if (!product) {
      return res
        .status(BAD_REQUEST_CODE)
        .send({ success: false, message: "Product not found" });
    }
    return res.status(SUCCESS_CODE).send({ success: true, product });
  }

  /**
   * Retrieves products based on filter criteria.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async getFilterData(req, res) {
    const { minPrice, maxPrice, category } = req.query;
    let categories = [];
    if (category) {
      categories = JSON.parse(category.replace(/'/g, '"'));
    }
    const products = await this.productRepository.filter(
      minPrice,
      maxPrice,
      categories
    );
    return res.status(SUCCESS_CODE).send({ success: true, products });
  }

  /**
   * Rates a product.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async rateProduct(req, res) {
    const userId = req.jwtUserID;
    const { productId, rating } = req.body;
    try {
      console.log("userId", userId, productId, rating);
      if (!productId || !rating) {
        throw new Error("Missing required fields");
      }
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

  /**
   * Retrieves the average price per category from the product repository.
   *
   * @async
   * @function getAveragePrice
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Sends a response with the average price per category.
   * @throws {Error} If there is an error retrieving the average price, sends an error response.
   */
  async getAveragePrice(req, res) {
    try {
      const averagePrice =
        await this.productRepository.getAveragePricePerCategory();
      return res.status(SUCCESS_CODE).send({ success: true, averagePrice });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ success: false, message: error.message });
    }
  }
  async getAverageRating(req, res) {
    try {
      const averageRating = await this.productRepository.getAverageRating();
      return res.status(SUCCESS_CODE).send({ success: true, averageRating });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ success: false, message: error.message });
    }
  }
  async getRatingCount(req, res) {
    try {
      const ratingCount = await this.productRepository.getRatingCount();
      return res.status(SUCCESS_CODE).send({ success: true, ratingCount });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ success: false, message: error.message });
    }
  }
}
