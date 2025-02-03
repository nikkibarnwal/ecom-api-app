import mongoose from "mongoose";
import {
  CATEGORY_COLLECTION,
  LIKES_COLLECTION,
  PRODUCT_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

const LikeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_COLLECTION,
    required: true,
  },
  //   here we can store the ID of eny collection, may be Product or Category Collection
  //  for this we have given refPath and defined types variable,
  //
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types", // in place of types we can write anything
  },
  // And here we are defining types defination
  types: {
    type: String,
    enum: [PRODUCT_COLLECTION, CATEGORY_COLLECTION],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LikeModel = mongoose.model(LIKES_COLLECTION, LikeSchema);

export default LikeModel;
