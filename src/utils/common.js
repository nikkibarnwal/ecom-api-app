import { ObjectId } from "mongodb";
import path from "path";

export const imagesPath = path.join(path.resolve(), "uploads");
export const uid = () => Date.now() + Math.floor(Math.random() * 1000000000);

export const InObjectId = (id) =>
  ObjectId.isValid(id) ? ObjectId.createFromHexString(id) : id;

export const splitTrim = (data, sepration = ",") =>
  data ? data.split(sepration).map((e) => e.trim()) : [];
