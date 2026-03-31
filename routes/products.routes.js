import express from "express";
import { body, query, param } from "express-validator";
import { handleValidations } from "../middleware/validator.middleware.js";

const router = express.Router();

// Sample Data
const products = [
  {
    id: 1,
    name: "MacBook Pro",
    price: 1999,
    category: "Electronics",
    stock: 10,
  },
  { id: 2, name: "iPhone 15", price: 999, category: "Electronics", stock: 25 },
  {
    id: 3,
    name: "Ergonomic Chair",
    price: 299,
    category: "Furniture",
    stock: 15,
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: 150,
    category: "Peripherals",
    stock: 30,
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 80,
    category: "Peripherals",
    stock: 50,
  },
  { id: 6, name: "4K Monitor", price: 400, category: "Electronics", stock: 12 },
  { id: 7, name: "Standing Desk", price: 550, category: "Furniture", stock: 8 },
  {
    id: 8,
    name: "Noise Cancelling Headphones",
    price: 350,
    category: "Audio",
    stock: 20,
  },
  {
    id: 9,
    name: "Smart Watch",
    price: 250,
    category: "Electronics",
    stock: 40,
  },
  { id: 10, name: "USB-C Hub", price: 60, category: "Accessories", stock: 100 },
];

/*
    GET REQUESTS
*/

// GET /api/products - Returns all Products
router.get("/", (req, res) => {
  res.send(products);
});

// GET /api/products/search - Searching for specific data
router.get("/search", [
  query("id").optional().isInt().toInt(),
  query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
  handleValidations
], (req, res) => {
  const { id, name, category, minPrice, maxPrice } = req.query;
  let filteredData = products;

  if (id) {
    filteredData = filteredData.filter(
      (product) => product.id === id,
    );
  }

  if (name) {
    filteredData = filteredData.filter(
      (product) => product.name.toLowerCase() === name.toLowerCase(),
    );
  }

  if (category) {
    filteredData = filteredData.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (minPrice) {
    filteredData = filteredData.filter(
      (product) => product.price >= minPrice,
    );
  }

  if (maxPrice) {
    filteredData = filteredData.filter(
      (product) => product.price <= maxPrice,
    );
  }

  // Check if data exists after filtering
  if (filteredData.length === 0)
    return res.status(404).json({ error: "No products available" });

  // Return filtered data
  res.json(filteredData);
});

// GET /api/products/:id - Get Specific Product
router.get("/:id", [
  param("id").isInt().toInt(),
  handleValidations
], (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/*
    POST REQUESTS
*/

// POST /api/products - Add new Product
router.post("/", [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number").toFloat(),
  handleValidations
], (req, res) => {
  const { name, price, category, stock } = req.body;

  const newProduct = {
    id: products.length > 0 ? products.at(-1).id + 1 : 1,
    name: name,
    price: price,
    category: category || "Uncategorized",
    stock: parseInt(stock) || 0,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/*
  PUT REQUESTS
*/

router.put("/:id", [
  param("id").isInt().toInt(),
  body("name").trim().notEmpty(),
  body("price").isFloat({ min: 0 }).toFloat(),
  body("category").optional().trim(),
  body("stock").optional().isInt({ min: 0 }).toInt(),
  handleValidations
], (req, res) => {
  // Find index of specific product
  const productIndex = products.findIndex(
    (product) => product.id === req.params.id,
  );

  // If not found (using === -1 to avoid bugs with index 0)
  if (productIndex === -1)
    return res.status(404).json({ error: "Product not found" });

  // Destruct request body
  const { name, price, category, stock } = req.body;

  // Update specific product's data
  products[productIndex] = {
    id: req.params.id,
    name: name,
    price: price,
    category: category || "Uncategorized",
    stock: parseInt(stock) || 0,
  };
  // Return Code 200 - Ok
  res.status(200).json(products[productIndex]);
});

/*
  PATCH REQUESTS
*/

router.patch("/:id", [
  param("id").isInt().toInt(),
  body("name").optional().trim().notEmpty(),
  body("price").optional().isFloat({ min: 0 }).toFloat(),
  handleValidations
], (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (req.body.id) delete req.body.id; // Prevents changes to ID
  Object.assign(product, req.body); // Update the specific product's data
  res.status(200).json(product); // Return Status code 200 - Ok
});

/*
  DELETE REQUESTS
*/

router.delete("/:id", [
  param("id").isInt().toInt(),
  handleValidations
], (req, res) => {
  const index = products.findIndex(
    (product) => product.id === req.params.id,
  ); // Find product to delete in data
  if (index === -1) return res.status(404).json({ error: "Product ID not found" }); // If not found return error
  const [deletedProduct] = products.splice(index, 1); // Delete specific product & store deleted record in variable

  res.status(200).json(deletedProduct); // Return the deleted product
});

export default router;