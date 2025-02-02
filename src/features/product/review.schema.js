import mongoose from "mongoose";
import {
  PRODUCT_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT_COLLECTION,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_COLLECTION,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewSchema;
