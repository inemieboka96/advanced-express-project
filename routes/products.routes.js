import express from "express";

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

/*
  PUT REQUESTS
*/

router.put("/:id", (req, res) => {
  // Find index of specific product
  const productIndex = products.findIndex(
    (product) => product.id === parseInt(req.params.id),
  );

  // If not found (using === -1 to avoid bugs with index 0)
  if (productIndex === -1)
    return res.status(404).json({ error: "Product not found" });

  // Destruct request body
  const { name, price, category, stock } = req.body;

  // Update specific product's data
  products[productIndex] = {
    id: parseInt(req.params.id),
    name: name,
    price: parseFloat(price),
    category: category || "Uncategorized",
    stock: parseInt(stock) || 0,
  };
  // Return Code 200 - Ok
  res.status(200).json(products[productIndex]);
});

/*
  PATCH REQUESTS
*/

router.patch("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (req.body.id) delete req.body.id; // Prevents changes to ID
  if (req.body.price) req.body.price = parseFloat(req.body.price); // Typecast to float
  if (req.body.stock) req.body.stock = parseInt(req.body.stock); // Typecast to int
  Object.assign(product, req.body); // Update the specific product's data
  res.status(200).json(product); // Return Status code 200 - Ok
});

/*
  DELETE REQUESTS
*/

router.delete("/:id", (req, res) => {
  const index = products.findIndex(
    (product) => product.id === parseInt(req.params.id),
  ); // Find product to delete in data
  if (index === -1) return res.status(404).json({ error: "Product ID not found" }); // If not found return error
  const [deletedProduct] = products.splice(index, 1); // Delete specific product & store deleted record in variable

  res.status(200).json(deletedProduct); // Return the deleted product
});

export default router;