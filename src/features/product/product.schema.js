import mongoose from "mongoose";
import { USER_COLLECTION } from "../../config/collection.js";

// name, desc, price, category, imageUrl, sizes = []

export const ProductSchema = new mongoose.Schema({
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
});
// export default mongoose.model("Product", ProductSchema);
