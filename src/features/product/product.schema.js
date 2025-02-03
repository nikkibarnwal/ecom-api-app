import mongoose from "mongoose";
import {
  CATEGORY_COLLECTION,
  REVIEWS_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

// name, desc, price, category, imageUrl, sizes = []

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: String,
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  sizes: { type: [String] },
  stock: { type: Number, default: 0 },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: REVIEWS_COLLECTION,
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: CATEGORY_COLLECTION,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// export default mongoose.model("Product", ProductSchema);
export default ProductSchema;
