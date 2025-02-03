import { ObjectId } from "mongodb";
import {
  PRODUCT_COLLECTION,
  REVIEWS_COLLECTION,
} from "../../config/collection.js";
import { getMongoDB } from "../../config/mongodb.js";
import {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import ProductSchema from "./product.schema.js";
import ReviewSchema from "./review.schema.js";
import { InObjectId } from "../../utils/common.js";
import CategoryModel from "./category.schema.js";

const ProductModel = mongoose.model(PRODUCT_COLLECTION, ProductSchema);
const ReviewModel = mongoose.model(REVIEWS_COLLECTION, ReviewSchema);

const getProductCollection = () => {
  const db = getMongoDB();
  return db.collection(PRODUCT_COLLECTION);
};

class ProductRespository {
  async add(productData) {
    try {
      // 1 Add product
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();
      // 2 Update categories
      await CategoryModel.updateMany(
        {
          _id: { $in: productData.categories },
        },
        {
          $push: {
            products: savedProduct._id,
          },
        }
      );
      return savedProduct;
    } catch (error) {
      throw new ApplicationError(
        "Problem with adding the product",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
  async getAll() {
    try {
      const productCollection = await getProductCollection();
      return await productCollection.find().toArray();
    } catch (error) {
      throw new ApplicationError(
        "Problem with getting the products",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  /**
   * Retrieves a product by its ID.
   *
   * @param {string} id - The ID of the product to retrieve.
   * @returns {Promise<Object|null>} The product object if found, otherwise null.
   * @throws {ApplicationError} If there is a problem with getting the product.
   */
  async get(id) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      const productCollection = await getProductCollection();
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      return product;
    } catch (error) {
      if (error instanceof TypeError) {
        return null;
      }
      throw new ApplicationError(
        "Problem with getting the product",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  async filter(minPrice, maxPrice, categories) {
    try {
      let filterExpression = {};
      if (minPrice !== undefined) {
        filterExpression.price = {
          $gte: Number(minPrice),
        };
      }
      if (maxPrice !== undefined) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: Number(maxPrice),
        };
      }
      if (categories && categories.length > 0) {
        filterExpression.category = { $in: categories };
      }
      return await getProductCollection()
        .find(filterExpression)
        .project({ name: 1, price: 1, ratings: 1, _id: 0 })
        .toArray();
      // return await productCollection
      //   .find(filterExpression)
      //   .project({ name: 1, price: 1, ratings: 1, _id: 0 })
      //   .toArray();
    } catch (error) {
      throw new ApplicationError(
        "Problem with filtering the product",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
  //   in below function we are updating the rating of the product but we can face the race problem
  /**MongoDB में Race Condition तब होती है जब एक ही डेटा पर एक साथ कई अनुरोध (requests) आते हैं और उनका ऑर्डर सही तरह से नियंत्रित नहीं किया जाता।
   * इस समस्या को हल करने के लिए atomic operations, transactions, और concurrency control जैसी तकनीकों का उपयोग करना आवश्यक है। */
  async rate_WithRaceProblem(userId, productId, rating) {
    try {
      const productCollection = await getProductCollection();
      //   find the product
      const product = await productCollection.findOne({
        _id: new ObjectId(productId),
      });
      if (!product) {
        throw new ApplicationError("Product not found", NOT_FOUND_CODE);
      } else {
        const userRating = product?.ratings?.find((r) => r.userId == userId);
        if (userRating) {
          await productCollection.updateOne(
            {
              _id: new ObjectId(productId),
              "ratings.userId": new ObjectId(userId),
            },
            /* here we are updating the rating of the user with the help of $ operator,
             that gives the first matched element from above given condition */
            { $set: { "ratings.$.rating": rating } }
          );
        } else {
          await productCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $push: { ratings: { userId: new ObjectId(userId), rating } } }
          );
        }
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Problem with rating the product",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  //   in below function we are updating the rating of the product and avoiding the race problem
  async rate(userId, productId, rating) {
    try {
      // 1 check if product exist
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new ApplicationError("Product not found", NOT_FOUND_CODE);
      }
      let savedReview;
      // 2 get existing reviews
      const userReview = await ReviewModel.findOne({
        product: InObjectId(productId),
        user: InObjectId(userId),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
        savedReview = userReview;
      } else {
        const newReview = ReviewModel({
          product: InObjectId(productId),
          user: InObjectId(userId),
          rating: rating,
        });
        await newReview.save();
        savedReview = newReview;
      }
      return savedReview;
    } catch (error) {
      throw new ApplicationError(
        "Problem with rating the product",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  async getAveragePricePerCategory() {
    try {
      const collection = getProductCollection();
      // here we want to return the average price of the product per category like below
      // { _id: "Electronics", averagePrice: 200 }
      // becasue we may have multiple records of the same category so we are using toArray() method
      return await collection
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw new ApplicationError(
        "Problem with getting the average price per category",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
  async getAverageRating() {
    try {
      const collection = await getProductCollection();
      return await collection
        .aggregate([
          { $unwind: "$ratings" },
          {
            $group: {
              _id: "$name",
              averageRating: { $avg: "$ratings.rating" },
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw new ApplicationError(
        "Problem with getting the average rating",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
  async getRatingCount() {
    try {
      const collection = await getProductCollection();
      return await collection
        .aggregate([
          {
            $project: {
              name: 1,
              countOfRatings: {
                $cond: {
                  // here we are checking if the ratings field is an array or not
                  if: { $isArray: "$ratings" },
                  then: { $size: "$ratings" },
                  else: 0,
                },
              },
              _id: 0,
            },
          },
          {
            // here we are sorting the products based on the countOfRatings field
            $sort: { countOfRatings: -1 },
          },
          // if we want to get only highest rating single product then we can use below code
          // { $limit: 1 },
          // if we want to get only lowest rating single product then we can use below code
          // { $limit: -1 },
        ])
        .toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Problem with getting the rating count",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
}

export default ProductRespository;
