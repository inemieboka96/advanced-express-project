import express from "express";
import { checkSchema } from "express-validator";
import { handleValidations } from "../middleware/validator.middleware.js";
import { products } from "../sampleData.js";
import { 
  productValidationSchema, 
  productSearchSchema, 
  idParamSchema 
} from "../utils/validationSchemas.js";

const router = express.Router();

// Local copy to avoid mutating original sample data
let productsData = [...products];

/*
    GET REQUESTS
*/

// GET /api/products - Returns all Products
router.get("/", (req, res) => {
  res.send(productsData);
});

// GET /api/products/search - Searching for specific data
router.get(
  "/search",
  checkSchema(productSearchSchema),
  handleValidations,
  (req, res) => {
    const { id, name, category, minPrice, maxPrice } = req.query;
    let filteredData = productsData;

    if (id) {
      filteredData = filteredData.filter((product) => product.id === id);
    }

    if (name) {
      filteredData = filteredData.filter(
        (product) => product.name.toLowerCase() === name.toLowerCase()
      );
    }

    if (category) {
      filteredData = filteredData.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice !== undefined) {
      filteredData = filteredData.filter((product) => product.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filteredData = filteredData.filter((product) => product.price <= maxPrice);
    }

    if (filteredData.length === 0)
      return res.status(404).json({ error: "No products available" });

    res.json(filteredData);
  }
);

// GET /api/products/:id - Get Specific Product
router.get(
  "/:id",
  checkSchema(idParamSchema),
  handleValidations,
  (req, res) => {
    const product = productsData.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  }
);

/*
    POST REQUESTS
*/

// POST /api/products - Add new Product
router.post(
  "/",
  checkSchema(productValidationSchema),
  handleValidations,
  (req, res) => {
    const { name, price, category, stock } = req.body;

    const newProduct = {
      id: productsData.length > 0 ? productsData.at(-1).id + 1 : 1,
      name,
      price,
      category: category || "Uncategorized",
      stock: stock || 0, // already sanitized to Int by schema
    };

    productsData.push(newProduct);
    res.status(201).json(newProduct);
  }
);

/*
    PUT REQUESTS
*/

// PUT /api/products/:id - Complete replacement
router.put(
  "/:id",
  checkSchema(idParamSchema),
  checkSchema(productValidationSchema),
  handleValidations,
  (req, res) => {
    const productIndex = productsData.findIndex(
      (product) => product.id === req.params.id
    );

    if (productIndex === -1)
      return res.status(404).json({ error: "Product not found" });

    const { name, price, category, stock } = req.body;

    productsData[productIndex] = {
      id: req.params.id,
      name,
      price,
      category: category || "Uncategorized",
      stock: stock || 0,
    };
    
    res.status(200).json(productsData[productIndex]);
  }
);

/*
    PATCH REQUESTS
*/

// PATCH /api/products/:id - Partial update
router.patch(
  "/:id",
  checkSchema(idParamSchema),
  // Modify schema to allow optional fields
  checkSchema(
    Object.fromEntries(
      Object.entries(productValidationSchema).map(([key, value]) => [
        key,
        { ...value, optional: true },
      ])
    )
  ),
  handleValidations,
  (req, res) => {
    const product = productsData.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.body.id) delete req.body.id; 
    Object.assign(product, req.body);
    res.status(200).json(product);
  }
);

/*
    DELETE REQUESTS
*/

// DELETE /api/products/:id
router.delete(
  "/:id",
  checkSchema(idParamSchema),
  handleValidations,
  (req, res) => {
    const index = productsData.findIndex(
      (product) => product.id === req.params.id
    );
    if (index === -1)
      return res.status(404).json({ error: "Product ID not found" });

    const [deletedProduct] = productsData.splice(index, 1);
    res.status(200).json(deletedProduct);
  }
);

export default router;