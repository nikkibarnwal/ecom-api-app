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

3. Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:

    ```env
    NODE_ENV=development
    PORT=3100
    DB_HOST=localhost
    DB_PORT=27017
    DB_NAME=ecom_db
    JWT_SECRET=your_jwt_secret
    SUCCESS_CODE=200
    CREATED_CODE=201
    NO_CONTENT_CODE=204
    BAD_REQUEST_CODE=400
    UNAUTHORIZED_CODE=401
    FORBIDDEN_CODE=403
    NOT_FOUND_CODE=404
    CONFLICT_CODE=409
    INTERNAL_SERVER_ERROR_CODE=500
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