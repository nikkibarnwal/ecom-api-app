import { describe, jest } from "@jest/globals";
import ProductController from "../product.controller.js";
import ProductRespository from "../product.repository.js";
import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  SUCCESS_CODE,
} from "../../../config/statusCode.js";

describe("ProductController", () => {
  let productController;
  let mockResponse;
  let mockRequest;

  beforeEach(() => {
    productController = new ProductController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockRequest = {};
  });

  describe("getAllProducts", () => {
    it("should return all products with success", async () => {
      const products = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ];
      jest
        .spyOn(ProductRespository.prototype, "getAll")
        .mockResolvedValue(products);

      await productController.getAllProducts(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(SUCCESS_CODE);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: true,
        products,
      });
    });

    it("should return an error if no products found", async () => {
      jest
        .spyOn(ProductRespository.prototype, "getAll")
        .mockResolvedValue(null);

      await productController.getAllProducts(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(BAD_REQUEST_CODE);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        message: "Product not found",
      });
    });
  });
  describe("addProduct", () => {
    it("should add a product successfully", async () => {
      const product = {
        name: "Test Product",
        desc: "Test Product Description",
        price: 100,
        category: "Test Category",
        sizes: "S, M, L",
      };
      mockRequest.body = product;
      mockRequest.file = {
        filename: "test.jpg",
      };
      jest
        .spyOn(ProductRespository.prototype, "add")
        .mockResolvedValue(product);

      await productController.addProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(CREATED_CODE);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: true,
        product,
      });
    });

    it("should return an error if no image is provided", async () => {
      mockRequest.body = {};
      mockRequest.file = null;

      await productController.addProduct(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(BAD_REQUEST_CODE);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        message: "Product image is required",
      });
    });
  });
});
