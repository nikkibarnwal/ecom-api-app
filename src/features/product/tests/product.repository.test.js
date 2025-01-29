import { MongoClient } from "mongodb";
import { jest } from "@jest/globals";
import ProductRepository from "../product.repository.js";
import ApplicationError from "../../../error-handler/applicationError.js";
import { PRODUCT_COLLECTION } from "../../../config/collection.js";

jest.mock("../../../config/mongodb.js", () => ({
  getMongoDB: jest.fn(),
}));

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  insertOne: jest.fn(),
  find: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
};

describe("ProductRepository", () => {
  beforeAll(() => {
    require("../../../config/mongodb.js").getMongoDB.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("add", () => {
    it("should add a product", async () => {
      const product = { name: "Test Product", price: 100 };
      const repository = new ProductRepository();
      await repository.add(product);
      expect(mockDb.insertOne).toHaveBeenCalledWith(
        expect.objectContaining(product)
      );
    });

    it("should throw an error if adding a product fails", async () => {
      mockDb.insertOne.mockRejectedValue(new Error("Insert failed"));
      const product = { name: "Test Product", price: 100 };
      const repository = new ProductRepository();
      await expect(repository.add(product)).rejects.toThrow(ApplicationError);
    });
  });

  describe("getAll", () => {
    it("should return all products", async () => {
      const products = [{ name: "Test Product", price: 100 }];
      mockDb.toArray.mockResolvedValue(products);
      const repository = new ProductRepository();
      const result = await repository.getAll();
      expect(result).toEqual(products);
    });

    it("should throw an error if getting all products fails", async () => {
      mockDb.toArray.mockRejectedValue(new Error("Find failed"));
      const repository = new ProductRepository();
      await expect(repository.getAll()).rejects.toThrow(ApplicationError);
    });
  });

  describe("get", () => {
    it("should return a product by id", async () => {
      const product = { name: "Test Product", price: 100 };
      mockDb.findOne.mockResolvedValue(product);
      const repository = new ProductRepository();
      const result = await repository.get("60c72b2f9b1d4c3d88f8b0f1");
      expect(result).toEqual(product);
    });

    it("should return null if id is invalid", async () => {
      const repository = new ProductRepository();
      const result = await repository.get("invalid-id");
      expect(result).toBeNull();
    });

    it("should throw an error if getting a product fails", async () => {
      mockDb.findOne.mockRejectedValue(new Error("Find failed"));
      const repository = new ProductRepository();
      await expect(repository.get("60c72b2f9b1d4c3d88f8b0f1")).rejects.toThrow(
        ApplicationError
      );
    });
  });

  describe("filter", () => {
    it("should return products based on filter criteria", async () => {
      const products = [{ name: "Test Product", price: 100 }];
      mockDb.toArray.mockResolvedValue(products);
      const repository = new ProductRepository();
      const result = await repository.filter(50, 150, [
        "category1",
        "category2",
      ]);
      expect(result).toEqual(products);
    });

    it("should throw an error if filtering products fails", async () => {
      mockDb.toArray.mockRejectedValue(new Error("Find failed"));
      const repository = new ProductRepository();
      await expect(
        repository.filter(50, 150, ["category1", "category2"])
      ).rejects.toThrow(ApplicationError);
    });

    it("should return products when only minPrice is provided", async () => {
      const products = [{ name: "Test Product", price: 100 }];
      mockDb.toArray.mockResolvedValue(products);
      const repository = new ProductRepository();
      const result = await repository.filter(50, undefined, undefined);
      expect(result).toEqual(products);
    });

    it("should return products when only maxPrice is provided", async () => {
      const products = [{ name: "Test Product", price: 100 }];
      mockDb.toArray.mockResolvedValue(products);
      const repository = new ProductRepository();
      const result = await repository.filter(undefined, 150, undefined);
      expect(result).toEqual(products);
    });

    it("should return products when categories is empty", async () => {
      const products = [{ name: "Test Product", price: 100 }];
      mockDb.toArray.mockResolvedValue(products);
      const repository = new ProductRepository();
      const result = await repository.filter(50, 150, []);
      expect(result).toEqual(products);
    });

    it("should return products when categories is undefined", async () => {
      const products = [{ name: "Test Product", price: 100 }];
      mockDb.toArray.mockResolvedValue(products);
      const repository = new ProductRepository();
      const result = await repository.filter(50, 150, undefined);
      expect(result).toEqual(products);
    });
  });
  describe("rate", () => {
    it("should update the rating of a product", async () => {
      const repository = new ProductRepository();
      await repository.rate(
        "60c72b2f9b1d4c3d88f8b0f1",
        "60c72b2f9b1d4c3d88f8b0f2",
        5
      );
      expect(mockDb.updateOne).toHaveBeenCalledTimes(2);
    });

    it("should throw an error if rating a product fails", async () => {
      mockDb.updateOne.mockRejectedValue(new Error("Update failed"));
      const repository = new ProductRepository();
      await expect(
        repository.rate(
          "60c72b2f9b1d4c3d88f8b0f1",
          "60c72b2f9b1d4c3d88f8b0f2",
          5
        )
      ).rejects.toThrow(ApplicationError);
    });
  });
});
