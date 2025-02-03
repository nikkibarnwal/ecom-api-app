import {
  CATEGORY_COLLECTION,
  PRODUCT_COLLECTION,
} from "../../config/collection.js";
import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";
import { likeTypeCollection } from "../../utils/common.js";
import LikeRepository from "./like.repository.js";

class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.jwtUserID;
      if (!likeTypeCollection.includes(type)) {
        return res.status(BAD_REQUEST_CODE).send({
          success: false,
          message: "Invalid type, it should be product or category",
        });
      }
      const newLike = await this.likeRepository.likeItem(userId, id, type);
      res
        .status(CREATED_CODE)
        .send({ success: true, data: newLike, message: "Like successfull" });
    } catch (error) {
      next(error);
    }
  }
  async getLike(req, res, next) {
    try {
      const { id, type } = req.query;
      if (!likeTypeCollection.includes(type)) {
        return res.status(BAD_REQUEST_CODE).send({
          success: false,
          message: "Invalid type, it should be product or category",
        });
      }
      const likes = await this.likeRepository.getItemLikes(id, type);
      res.status(SUCCESS_CODE).json({
        success: true,
        data: likes,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikeController;
