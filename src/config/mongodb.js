import { MongoClient } from "mongodb";
import users from "../data/users.json" assert { type: "json" };
import categorys from "../data/categorys.json" assert { type: "json" };
import products from "../data/products.json" assert { type: "json" };
import {
  CATEGORY_COLLECTION,
  PRODUCT_COLLECTION,
  USER_COLLECTION,
} from "../config/collection.js";

let client;
const checkAndInsertData = async (collection, data) => {
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertMany(data);
    console.log(`Inserted data into ${collection.collectionName}`);
  } else {
    console.log(`Data already exists in ${collection.collectionName}`);
  }
};

export const connectToMongoDB = () => {
  MongoClient.connect(process.env.MONGO_URL).then((clientInstance) => {
    console.log("Connected to MongoDB");
    client = clientInstance;
    const db = client.db();
    /**inserting default data to the collections */
    const productsCollection = db.collection(PRODUCT_COLLECTION);
    const categorysCollection = db.collection(CATEGORY_COLLECTION);
    const usersCollection = db.collection(USER_COLLECTION);

    checkAndInsertData(productsCollection, products);
    checkAndInsertData(categorysCollection, categorys);
    checkAndInsertData(usersCollection, users);
  });
};
export const getMongoDB = () => {
  return client.db();
  //   we are not using any database name here because
  //   we are using the default database in the connection string
  /*  return client.db("ecom-db"); */
};
