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

// Path variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route Handler
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send({ msg: "Users & Products API" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
