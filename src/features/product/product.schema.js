import mongoose from "mongoose";
import {
  REVIEWS_COLLECTION,
  USER_COLLECTION,
} from "../../config/collection.js";

// name, desc, price, category, imageUrl, sizes = []

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  sizes: { type: [String] },
  stock: { type: Number, default: 0 },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION,
        required: true,
      },
      rating: { type: Number, required: true },
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: REVIEWS_COLLECTION,
    },
  ],
});
// export default mongoose.model("Product", ProductSchema);
export default ProductSchema;
