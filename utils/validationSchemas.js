import { ACCEPTABLE_ROLES } from "../sampleData.js";

export const userValidationSchema = {
  username: {
    trim: true,
    notEmpty: { errorMessage: "Username is required" },
    isLength: {
      options: { min: 5, max: 32 },
      errorMessage: "5-32 chars required",
    },
  },
  email: {
    isEmail: { errorMessage: "Invalid email" },
    normalizeEmail: true,
  },
  age: {
    optional: true,
    isInt: { options: { min: 0 } },
    toInt: true,
  },
  role: {
    optional: true,
    isIn: { options: [ACCEPTABLE_ROLES] },
  },
};

export const productValidationSchema = {
  name: { trim: true, notEmpty: true },
  price: { isFloat: { options: { min: 0 } }, toFloat: true },
  category: { optional: true, trim: true },
  stock: { optional: true, isInt: { options: { min: 0 } }, toInt: true },
};

// Specifically for GET /search
export const userSearchSchema = {
  id: { optional: true, isInt: true, toInt: true },
  username: { optional: true, trim: true, notEmpty: true },
  email: { optional: true, isEmail: true, normalizeEmail: true },
  role: { optional: true, isIn: { options: [ACCEPTABLE_ROLES] } },
};

export const productSearchSchema = {
  id: { optional: true, isInt: true, toInt: true },
  name: { optional: true, trim: true },
  category: { optional: true, trim: true },
  minPrice: { optional: true, isFloat: { options: { min: 0 } }, toFloat: true },
  maxPrice: { optional: true, isFloat: { options: { min: 0 } }, toFloat: true },
};

// Generic ID param validation for /:id routes
export const idParamSchema = {
  id: {
    in: ["params"],
    isInt: true,
    toInt: true,
    errorMessage: "ID must be an integer",
  },
};