/**1 import express */
/** And other important modules */

import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuthorizer.middleware.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";

import cartRouter from "./src/features/cart/cart.routes.js";
import apiDoc from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import invalidRoutesHandlerMiddleware from "./src/middlewares/invalidRoutes.middleware.js";
import { errorHandlerMiddleware } from "./src/middlewares/errorHandler.middleware.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import likeRouter from "./src/features/like/like.route.js";

/** 2 create server */
const app = express();

/**Cors policy configuration */
/*
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
*/
/** CORS policy by library */

/** 2.1 enable cors */
// Allow all origins
app.use(cors());

// Allow specific origin
app.use(cors({ origin: "http://localhost:5500" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

/**3 Default API route */
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

/**set swagger route */
/**Swagger url http://localhost:3100/api-docs/ */
app.use("/api-docs", swagger.serve, swagger.setup(apiDoc));

app.use("/api/products", jwtAuth, productRouter);
app.use("/api/cart", jwtAuth, cartRouter);
app.use("/api/orders", jwtAuth, orderRouter);
app.use("/api/likes", jwtAuth, likeRouter);

// To verify user by basic authentication
// app.use("/api/products", basicAuthorizer, productRouter);

app.use("/api/users", userRouter);

/**  This middlware will handle all type of errors at application level*/
/** Error handler middleware */
// app.use((err, req, res, next) => {
//   /**Check if error is coming from ApplicationError.js file */
//   if (err instanceof ApplicationError) {
//     return res.status(err.statusCode).send(err.message);
//   }
//   console.error(err);
//   res.status(500).send("Something broke! please try again later");
// });
// Middleware to handle errors
app.use(errorHandlerMiddleware);

/** 4 Middleware to handle 404 response */
app.use(invalidRoutesHandlerMiddleware);

/** 5 specify port */
app.listen(process.env.PORT, () => {
  console.log("Server is listoning on " + process.env.PORT);
  /** 6 connect to mongodb */
  // connectToMongoDB();
  connectUsingMongoose();
});
