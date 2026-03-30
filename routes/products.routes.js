import express from "express";

const router = express.Router();

// Sample Data
const products = [
  { id: 1, name: "MacBook Pro", price: 1999, category: "Electronics", stock: 10 },
  { id: 2, name: "iPhone 15", price: 999, category: "Electronics", stock: 25 },
  { id: 3, name: "Ergonomic Chair", price: 299, category: "Furniture", stock: 15 },
  { id: 4, name: "Mechanical Keyboard", price: 150, category: "Peripherals", stock: 30 },
  { id: 5, name: "Gaming Mouse", price: 80, category: "Peripherals", stock: 50 },
  { id: 6, name: "4K Monitor", price: 400, category: "Electronics", stock: 12 },
  { id: 7, name: "Standing Desk", price: 550, category: "Furniture", stock: 8 },
  { id: 8, name: "Noise Cancelling Headphones", price: 350, category: "Audio", stock: 20 },
  { id: 9, name: "Smart Watch", price: 250, category: "Electronics", stock: 40 },
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
router.get("/search", (req, res) => {
  const { id, name, category, minPrice, maxPrice } = req.query;
  let filteredData = products;

  if (id) {
    if (isNaN(parseInt(id)))
      return res.status(400).json({ error: "ID must be a number" });

    filteredData = filteredData.filter(
      (product) => parseInt(product.id) === parseInt(id),
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
      (product) => product.price >= parseFloat(minPrice),
    );
  }

  if (maxPrice) {
    filteredData = filteredData.filter(
      (product) => product.price <= parseFloat(maxPrice),
    );
  }

  // Check if data exists after filtering
  if (filteredData.length === 0)
    return res.status(404).json({ error: "No products available" });

  // Return filtered data
  res.json(filteredData);
});

// GET /api/products/:id - Get Specific Product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: `Product ${req.params.id} not found` });
  }
});

/*
    POST REQUESTS
*/

// POST /api/products - Add new Product
router.post("/", (req, res) => {
  const { name, price, category, stock } = req.body;

  // Validation of required fields
  if (!name || !price)
    return res.status(400).json({ error: "Name and Price are required" });

  const newProduct = {
    id: products.length > 0 ? products.at(-1).id + 1 : 1,
    name: name,
    price: parseFloat(price),
    category: category || "Uncategorized",
    stock: parseInt(stock) || 0,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

export default router;