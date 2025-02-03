import mongoose from "mongoose";
import CategoryModel from "../features/product/category.schema.js";

export const connectUsingMongoose = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB using Mongoose");
        addCategories();
      });
  } catch (error) {
    console.error("Error connecting to MongoDB using Mongoose", error);
  }
};

const addCategories = async () => {
  try {
    const categories = await CategoryModel.find();
    if (!categories || categories.length == 0) {
      await CategoryModel.insertMany([
        {
          name: "Books",
          description:
            "A collection of written works, including novels, textbooks, and comics.",
        },
        {
          name: "Clothes",
          description:
            "Garments and apparel for men, women, and children in various styles.",
        },
        {
          name: "Electronics",
          description:
            "Devices like smartphones, laptops, and home appliances for daily use.",
        },
        {
          name: "Furnitures",
          description:
            "Household and office furniture, including tables, chairs, and sofas.",
        },
        {
          name: "Toys",
          description:
            "Playthings for children, including dolls, action figures, and board games.",
        },
        {
          name: "Artificial Jewellery",
          description:
            "Fashion accessories made from non-precious metals and stones.",
        },
      ]);
    }
    console.log("Categories added");
  } catch (error) {
    console.error("Error connecting to MongoDB using Mongoose", error);
  }
};
