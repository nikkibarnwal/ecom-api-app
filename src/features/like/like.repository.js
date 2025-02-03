import {
  CATEGORY_COLLECTION,
  PRODUCT_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";
import { INTERNAL_SERVER_ERROR_CODE } from "../../config/statusCode.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { InObjectId } from "../../utils/common.js";
import LikeModel from "./like.schema.js";

class LikeRepository {
  async likeItem(userId, itemId, type) {
    try {
      let userLikes = await LikeModel.findOne({
        user: InObjectId(userId),
        likeable: InObjectId(itemId),
      });
      if (!userLikes) {
        const newLike = {
          user: InObjectId(userId),
          likeable: InObjectId(itemId),
          types: type == "product" ? PRODUCT_COLLECTION : CATEGORY_COLLECTION,
        };
        const savedLike = new LikeModel(newLike);
        await savedLike.save();
        userLikes = savedLike;
      }
      return userLikes;
    } catch (error) {
      throw new ApplicationError(
        "Error liking the product",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }

  async unlikeProduct(userId, productId) {
    try {
      const result = await LikeModel.findOneAndDelete({ userId, productId });
      return result;
    } catch (error) {
      throw new Error("Error unliking the product: " + error.message);
    }
  }

  async getItemLikes(id, type) {
    try {
      const collectionName =
        type == "product" ? PRODUCT_COLLECTION : CATEGORY_COLLECTION;
      return await LikeModel.find({
        likeable: InObjectId(id),
        types: collectionName,
      })
        .populate("user")
        // here path and model is predefined attributes for populate
        .populate({ path: "likeable", model: collectionName });
    } catch (error) {
      throw new ApplicationError(
        "Error fetching likes",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }

  async getLikesByUser(userId) {
    try {
      const likes = await LikeModel.find({ user: InObjectId(userId) })
        .populate("user")
        // here path and model is predefined attributes for populate
        .populate({ path: "likeable", model: collectionName });
      return likes;
    } catch (error) {
      throw new ApplicationError(
        "Error fetching likes",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
}

export default LikeRepository;
