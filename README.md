# Ecom API App

This is the backend for the Ecom API application built with Node.js and Express.

## Features

- **User Authentication**: Secure user authentication and authorization.
- **Product Management**: CRUD operations for managing products.
- **Cart Management**: Manage user carts and cart items.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository:

    ```sh
    git clone <repository-url>
    cd ecom-api-app/backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    NODE_ENV=development
    PORT=3100
    DB_HOST=localhost
    DB_PORT=27017
    DB_NAME=ecom_db
    MONGO_URL=mongodb://localhost:27017/ecom-db
    JWT_SECRET=your_jwt_secret
   
    ```

4. Start the MongoDB server:

    ```sh
    mongod
    ```

5. Start the application:

    ```sh
    npm start
    ```

## API Documentation

The API is documented using Swagger. You can access the Swagger UI at `/api-docs` once the server is running.

## Running Tests

To run the tests, use the following command:

```sh
npm test
```
## Project Structure

backend/
    .babelrc
    .env
    .gitignore
    access.log
    APIs-list.txt
    combined.log
    env.js
    error.log
    jest.config.js
    log.txt
    package.json
    projectionOperators.readme.md
    README.md
    server.js
    src/
        config/
            collection.js
            mongodb.js
            statusCode.js
        data/
            carts.json
            categorys.json
            orders.json
            products.json
            users.json
        error-handler/
        features/
        middlewares/
        utils/
    swagger-2.0.json
    swagger.json
    tests/
        invalidRoutes.middleware.test.js
    uploads/
frontend/
    index.html


## Dependencies
    bcrypt: A library to help you hash passwords. It is used for securely storing user passwords.
    body-parser: Middleware to parse incoming request bodies in a middleware before your handlers, available under the req.body property.
    cors: A package to provide a Connect/Express middleware that can be used to enable CORS with various options.
    dotenv: A zero-dependency module that loads environment variables from a .env file into process.env.
    express: A fast, unopinionated, minimalist web framework for Node.js.
    express-validator: A set of express.js middlewares that wraps validator.js validator and sanitizer functions.
    jsonwebtoken: A library to sign, verify, and decode JSON Web Tokens (JWT).
    mongodb: The official MongoDB driver for Node.js. It allows Node.js applications to connect to MongoDB and work with data.
    multer: A middleware for handling multipart/form-data, which is primarily used for uploading files.
    swagger-ui-express: Middleware to serve auto-generated swagger-ui
    generated API docs from express.
    winston: A versatile logging library for Node.js.