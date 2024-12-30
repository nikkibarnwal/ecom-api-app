/**1 import express */
/** And other important modules */
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basicAuthorizer.middlware.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import { configDotenv } from "dotenv";
import cartRouter from "./src/features/cart/cart.routes.js";
import apiDoc from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";

/** 2 create server */
const app = express();
configDotenv();

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

/**  This middlware will handle all type of errors at application level*/
/** Error handler middleware */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke! please try again later");
});

/**set swagger route */
/**Swagger url http://localhost:3100/api-docs/ */
app.use("/api-docs", swagger.serve, swagger.setup(apiDoc));

app.use("/api/products", jwtAuth, productRouter);
app.use("/api/cart", jwtAuth, cartRouter);

// To verify user by basic authentication
// app.use("/api/products", basicAuthorizer, productRouter);

app.use("/api/users", userRouter);

/** 4 Middleware to handle 404 response */
app.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found, please check our documentation for more information at http://localhost:3100/api-docs"
    );
});

/** 5 specify port */
app.listen(process.env.PORT, () => {
  console.log("Server is listoning on " + process.env.PORT);
});
