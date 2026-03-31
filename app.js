import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/users.routes.js";
import productRoutes from "./routes/products.routes.js";

const app = express();

// JSON Middleware
app.use(express.json());

// Logger Middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`); // e.g. GET api/users
  next(); // Call the next middleware function
};

// Invoke middleware (Globally) i.e. for all endpoints
app.use(loggingMiddleware);

// For specific endpoints e.g. GET only

/*
  app.get("/",loggingMiddleware,(req,res)=>{
      GET request logic
    });
*/

// Path variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API BASE URLs
const USERS_API_URL = "/api/users";
const PRODUCTS_API_URL = "/api/products";

// Route Handler
app.use(USERS_API_URL, userRoutes);
app.use(PRODUCTS_API_URL, productRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send({ msg: "Users & Products API" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
