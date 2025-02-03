import mongoose from "mongoose";
import {
  CATEGORY_COLLECTION,
  PRODUCT_COLLECTION,
} from "../../config/collection.js";

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Atleast 3 character"],
  },
  description: {
    type: String,
    required: true,
    minLength: [3, "Atleast 3 character"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: PRODUCT_COLLECTION,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CategoryModel = mongoose.model(CATEGORY_COLLECTION, CategorySchema);
export default CategoryModel;
