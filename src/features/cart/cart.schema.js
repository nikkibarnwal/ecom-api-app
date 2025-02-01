import mongoose from "mongoose";
import {
  PRODUCT_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

// productId, userId, quantity
export const CartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PRODUCT_COLLECTION,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_COLLECTION,
    required: true,
  },
  quantity: Number,
});
