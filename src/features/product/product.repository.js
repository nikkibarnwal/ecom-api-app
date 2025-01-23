import { ObjectId } from "mongodb";
import { PRODUCT_COLLECTION } from "../../config/collection.js";
import { getMongoDB } from "../../config/mongodb.js";
import {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";

const getProductCollection = () => {
  const db = getMongoDB();
  return db.collection(PRODUCT_COLLECTION);
};

class ProductRespository {
  async add(product) {
    try {
      product.createdAt = new Date();
      const productCollection = await getProductCollection();
      await productCollection.insertOne(product);
      return product;
    } catch (error) {
      throw new ApplicationError(
        "Problem with adding the product",
        INTERNAL_SERVER_ERROR_CODE
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
  async get(id) {
    try {
      const productCollection = await getProductCollection();
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      return product;
    } catch (error) {
      throw new ApplicationError(
        "Problem with getting the product",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  async filter(minPrice, maxPrice, category) {
    try {
      const filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: Number(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: Number(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      const productCollection = await getProductCollection();
      return await productCollection.find(filterExpression).toArray();
    } catch (error) {
      throw new ApplicationError(
        "Problem with filtering the product",
        INTERNAL_SERVER_ERROR_CODE
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
      const productCollection = await getProductCollection();
      //  remove existing rating of the user
      await productCollection.updateOne(
        {
          _id: new ObjectId(productId),
        },
        { $pull: { ratings: { userId: new ObjectId(userId) } } }
      );
      //   add new rating of the user
      await productCollection.updateOne(
        {
          _id: new ObjectId(productId),
        },
        { $push: { ratings: { userId: new ObjectId(userId), rating } } }
      );
    } catch (error) {
      throw new ApplicationError(
        "Problem with rating the product",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
}

export default ProductRespository;
