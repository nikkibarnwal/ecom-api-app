import ApplicationError from "../../error-handler/applicationError.js";
import { uid } from "../../utils/common.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, price, category, imageUrl, sizes = [], id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.category = category;
    this.imageUrl = imageUrl;
    this.sizes = sizes;
  }
  static getAll() {
    return products;
  }
  static add(product) {
    product.id = uid();
    products.push(product);
    return product;
  }
  static get(id) {
    return products.find((p) => Number(p.id) == Number(id));
  }
  static filterProduct(minPrice, maxPrice, category) {
    const result = products.filter(
      (p) =>
        (!minPrice || Number(p.price) >= Number(minPrice)) &&
        (!maxPrice || Number(p.price) <= Number(maxPrice)) &&
        (!category ||
          category.trim().toLowerCase() == category.trim().toLowerCase())
    );
    return result;
  }
  static rateProduct(userId, productId, rating) {
    // 1 validation part
    const userDetail = UserModel.getAllUsers().find((u) => u.id == userId);
    if (!userDetail) {
      throw new ApplicationError("User not found", 404);
    }
    const product = this.getAll().find((p) => p.id == productId);
    if (!product) {
      throw new ApplicationError("Product not found", 404);
    }
    // check product have ratings
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userId: userId,
        rating: rating,
      });
    } else {
      // if user rating already given
      const existingRating = product.ratings.findIndex(
        (r) => r.userId == userId
      );
      if (existingRating >= 0) {
        product.ratings[existingRating] = {
          userId: userId,
          rating: rating,
        };
      } else {
        // if user dosen't have ratings
        product.ratings.push({
          userId: userId,
          rating: rating,
        });
      }
    }
  }
}

const products = [
  new ProductModel(
    "Product 1",
    "Description for Product 1",
    19.99,
    "Cateogory1",
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    1
  ),
  new ProductModel(
    "Product 2",
    "Description for Product 2",
    29.99,
    "Cateogory2",
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    ["M", "XL"],
    2
  ),
  new ProductModel(
    "Product 3",
    "Description for Product 3",
    39.99,
    "Cateogory3",
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    ["M", "XL", "S"],
    3
  ),
];
