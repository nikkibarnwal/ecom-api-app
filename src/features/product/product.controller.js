import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    try {
      const products = ProductModel.getAll();
      res.status(200).send(products);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  addProduct(req, res) {
    const { name, price, sizes } = req.body;

    const newProduct = {
      name,
      price: parseFloat(price),
      sizes: sizes ? sizes.split(",") : [],
      // imageUrl: req.file.filename,
    };
    const product = ProductModel.add(newProduct);
    res.status(201).send({ success: true, product });
  }

  getOneProduct(req, res) {
    const productId = req.params.id;
    const product = ProductModel.get(productId);
    if (!product) {
      return res
        .status(400)
        .send({ success: false, message: "Product not found" });
    }
    return res.status(200).send({ product });
  }
  getFilterData(req, res) {
    const { minPrice, maxPrice, category } = req.query;
    const product = ProductModel.filterProduct(minPrice, maxPrice, category);
    return res.status(200).send({ product });
  }
  rateProduct(req, res) {
    const userId = req.jwtUserID;
    const { productId, rating } = req.body;
    try {
      if (!productId || !rating) {
        throw new Error("Missing required fields");
      }
      ProductModel.rateProduct(userId, productId, rating);
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
    return res
      .status(200)
      .send({ success: true, message: "Rating has been done" });
  }
}
