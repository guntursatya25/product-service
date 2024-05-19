const Product = require("../models/Product");
const Yup = require("yup");
const path = require("path");
const fs = require("fs");

const productSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().required(),
});

exports.createProduct = async (req, res) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });

    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.create({ name, price, description, image });

    res.status(201).json(product);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagePath = path.join(__dirname, "../../uploads", product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await product.destroy();
    res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.price = price;
    product.description = description;
    if (image) {
      product.image = image;
    }

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    res.status(400).json({ message: error.message });
  }
};
