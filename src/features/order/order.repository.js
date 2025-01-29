import { ObjectId } from "mongodb";
import {
  CART_COLLECTION,
  ORDER_COLLECTION,
  PRODUCT_COLLECTION,
} from "../../config/collection.js";
import { getClient, getMongoDB } from "../../config/mongodb.js";
import { INTERNAL_SERVER_ERROR_CODE } from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { InObjectId } from "../../utils/common.js";
import OrderModel from "./order.model.js";

const getOrderCollection = () => {
  const db = getMongoDB();
  return db.collection(ORDER_COLLECTION);
};
const getCartCollection = () => {
  const db = getMongoDB();
  return db.collection(CART_COLLECTION);
};
const getProductCollection = () => {
  const db = getMongoDB();
  return db.collection(PRODUCT_COLLECTION);
};

class OrderRepository {
  async placeOrder(userId) {
    /**
     * here we are doing multiple DB operations if anyone fails then all DB transaction should be rollback
     * to achieve this we need to use the transaction in MongoDB
     */
    const dbClient = getClient();
    const session = dbClient.startSession();
    try {
      session.startTransaction();
      // 1- get cartItems and calculate total price
      const items = await this.getTotalAmount(userId);
      //   find the total amount of all items in the cart
      const finalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      // 2- create order record in order collection
      const newOrder = new OrderModel(
        InObjectId(userId),
        finalAmount,
        new Date()
      );
      await getOrderCollection().insertOne(newOrder, { session });
      // 3- update product stock
      for (let item of items) {
        await getProductCollection().updateOne(
          { _id: new ObjectId(item.productId) },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          { session }
        );
      }
      // 4- empty cart items
      await getCartCollection().deleteMany(
        { userId: InObjectId(userId) },
        { session }
      );

      session.commitTransaction();
      session.endSession();
      return; // Example response
    } catch (error) {
      // if any error occurs then rollback the transaction
      session.abortTransaction();
      session.endSession();
      console.error("Error in placing order", error);
      throw new ApplicationError(
        "Problem with placing the order",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
  async getTotalAmount(userId) {
    const collection = await getCartCollection();

    const items = await collection
      .aggregate([
        //1- get cart items for given userId
        {
          $match: {
            userId: InObjectId(userId),
          },
        },
        //2- get product details for each cart item
        {
          $lookup: {
            from: PRODUCT_COLLECTION,
            localField: "productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        //   3- unwind productInfo array
        {
          $unwind: "$productInfo",
        },
        //   4- calculate total amount for each cart item
        {
          $addFields: {
            totalAmount: {
              $multiply: ["$quantity", "$productInfo.price"],
            },
          },
        },
      ])
      .toArray();

    return items;
  }
  async getOrders() {
    const orderCollection = getOrderCollection();
    const orders = await orderCollection.find({}).toArray();
    return orders;
  }
}

export default OrderRepository;
