import { CART_COLLECTION } from "../../config/collection.js";
import { getMongoDB } from "../../config/mongodb.js";
import { InObjectId } from "../../utils/common.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { INTERNAL_SERVER_ERROR_CODE } from "../../config/statusCode.js";

export const getCartCollection = () => {
  const db = getMongoDB();
  return db.collection(CART_COLLECTION);
};
class CartRepository {
  async createCart(userId, productId, quantity) {
    try {
      const cartCollection = await getCartCollection();

      //   Here in place of findOneAndUpdate, we can also use updateOne method to insert the document in the collection.
      const result = await cartCollection.findOneAndUpdate(
        {
          userId: InObjectId(userId),
          productId: InObjectId(productId),
        },
        {
          $inc: { quantity: quantity }, // increase the quantity
        },
        {
          upsert: true, // If we dont have the document then it will insert the document
          returnDocument: "after", // return the updated document
        }
      );

      return result;
    } catch (error) {
      throw new ApplicationError(
        "Problem with creating the cart",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }

  async getCartByUserId(userId) {
    try {
      const cartCollection = await getCartCollection();
      return await cartCollection
        .find({ userId: InObjectId(userId) })
        .toArray();
    } catch (error) {
      throw new ApplicationError(
        "Problem with getting the cart",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  async delete(cartId, userId) {
    try {
      const cartCollection = await getCartCollection();
      const result = await cartCollection.deleteOne({
        _id: InObjectId(cartId),
        userId: InObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      throw new ApplicationError(
        "Problem with deleting the cart",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
  async clear(userId) {
    try {
      const cartCollection = await getCartCollection();
      await cartCollection.deleteMany({
        userId: InObjectId(userId),
      });
    } catch (error) {
      throw new ApplicationError(
        "Problem with clearing the cart",
        INTERNAL_SERVER_ERROR_CODE
      );
    }
  }
}
export default CartRepository;
