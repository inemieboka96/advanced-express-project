# Advanced Express.js Tutorial Project

**Current Version:** 1.0.0

Welcome to the **Advanced Express.js Tutorial Project**! This repository is a companion to the [Express.js Tutorial - All You Need to Know](https://youtu.be/nH9E25nkk3I) video, focusing on moving beyond basic routing to building production-ready web applications.

## 🚀 Overview

This project explores the deeper features of Express.js, including complex middleware patterns, RESTful API design, database integration, and security best practices. By the end of this tutorial, you'll have a solid foundation for building scalable back-end services.

## 📚 Table of Contents
- [Features](#-features)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Environment Configuration](#-environment-configuration)
- [Project Structure](#-project-structure)
- [Advanced Concepts Covered](#-advanced-concepts-covered)
- [Ignored Files](#-ignored-files)
- [Scripts](#-scripts)

## ✨ Features
- **Modular Routing**: Organized using `express.Router()`.
- **Full CRUD Operations**: Complete implementation of GET, POST, PUT, PATCH, and DELETE handlers for Users and Products.
- **Advanced Filtering**: Robust search endpoints with dynamic query parameter validation and refined error handling for empty results.
- **Input Validation**: Sanitizing and validating user data.
- **Security Layers**: Implementation of `helmet`, `cors`, and rate limiting.
- **Template Engines**: Dynamic rendering with EJS.
- **Environment Management**: Using `dotenv` for secret management.

## 🛠 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/advanced-express-project.git
   cd advanced-express-project
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## API Endpoints

### Users Endpoints

**Base URL:** `/api/users`

#### GET `/api/users`
Returns all users.

**Response:** `200 OK` — Array of all user objects.

---

#### GET `/api/users/search`
Search users by query parameters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Filter by user ID |
| `username` | string | Filter by username (case-insensitive) |
| `email` | string | Filter by email (case-insensitive) |
| `role` | string | Filter by role (case-insensitive) |
| `age` | number | Filter by age |

**Responses:**
- `200 OK` — Filtered array of matching users
- `400 Bad Request` — `{ "error": "ID must be a number" }` (if ID is non-numeric)
- `404 Not Found` — `{ "error": "No users matching criteria" }` (if no results)

---

#### GET `/api/users/:id`
Returns a specific user by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The user's ID |

**Responses:**
- `200 OK` — User object
- `404 Not Found` — `{ "error": "User {id} not found" }`

---

#### POST `/api/users`
Creates a new user.

**Request Body:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `username` | string | ✅ | — |
| `email` | string | ✅ | — |
| `role` | string | ❌ | `"user"` |
| `age` | number | ❌ | `0` |

**Responses:**
- `201 Created` — Newly created user object
- `400 Bad Request` — `{ "error": "Username and Email are required" }`

---

#### PUT `/api/users/:id`
Fully replaces a user's data by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The user's ID |

**Request Body:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `username` | string | ✅ | — |
| `email` | string | ✅ | — |
| `role` | string | ❌ | `"user"` |
| `age` | number | ✅ | — |

**Responses:**
- `200 OK` — Updated user object
- `404 Not Found` — `{ "error": "User not found" }`

---

#### PATCH `/api/users/:id`
Partially updates a user's data by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The user's ID |

**Request Body:** Any subset of user fields (excluding `id`, which is protected).

**Responses:**
- `200 OK` — Updated user object
- `404 Not Found` — `{ "error": "User not found" }`

---

#### DELETE `/api/users/:id`
Deletes a user by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The user's ID |

**Responses:**
- `200 OK` — Deleted user object
- `404 Not Found` — `{ "error": "User ID not found" }`

---

### Products Endpoints

**Base URL:** `/api/products`

#### GET `/api/products`
Returns all products.

**Response:** `200 OK` — Array of all product objects.

---

#### GET `/api/products/search`
Search products by query parameters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Filter by product ID |
| `name` | string | Filter by name (case-insensitive, exact match) |
| `category` | string | Filter by category (case-insensitive) |
| `minPrice` | number | Filter by minimum price (inclusive) |
| `maxPrice` | number | Filter by maximum price (inclusive) |

**Responses:**
- `200 OK` — Filtered array of matching products
- `400 Bad Request` — `{ "error": "ID must be a number" }` (if ID is non-numeric)
- `404 Not Found` — `{ "error": "No products available" }` (if no results)

---

#### GET `/api/products/:id`
Returns a specific product by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The product's ID |

**Responses:**
- `200 OK` — Product object
- `404 Not Found` — `{ "error": "Product {id} not found" }`

---

#### POST `/api/products`
Creates a new product.

**Request Body:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `name` | string | ✅ | — |
| `price` | number | ✅ | — |
| `category` | string | ❌ | `"Uncategorized"` |
| `stock` | number | ❌ | `0` |

**Responses:**
- `201 Created` — Newly created product object
- `400 Bad Request` — `{ "error": "Name and Price are required" }`

---

#### PUT `/api/products/:id`
Fully replaces a product's data by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The product's ID |

**Request Body:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `name` | string | ✅ | — |
| `price` | number | ✅ | — |
| `category` | string | ❌ | `"Uncategorized"` |
| `stock` | number | ❌ | `0` |

**Responses:**
- `200 OK` — Updated product object
- `404 Not Found` — `{ "error": "Product not found" }`

---

#### PATCH `/api/products/:id`
Partially updates a product's data by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The product's ID |

**Request Body:** Any subset of product fields (excluding `id`, which is protected).

**Responses:**
- `200 OK` — Updated product object
- `404 Not Found` — `{ "error": "Product not found" }`

---

#### DELETE `/api/products/:id`
Deletes a product by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The product's ID |

**Responses:**
- `200 OK` — Deleted product object
- `404 Not Found` — `{ "error": "Product ID not found" }`

## 🔐 Environment Configuration

Create a `.env` file in the root directory and define your variables:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/advanced_express
SESSION_SECRET=your_super_secret_key
```

## 📂 Project Structure

```text
├── src/
│   ├── routes/         # API and Web route definitions
│   ├── middleware/     # Custom logic for request/response cycles
│   ├── controllers/    # Business logic for specific routes
│   ├── models/         # Database schemas and models
│   ├── views/          # EJS templates for front-end rendering
│   └── app.js          # Main application entry point
├── .env                # Secret management
└── package.json        # Project metadata
```

## 🧠 Advanced Concepts Covered
1. **The Request-Response Cycle**: Deep dive into how Express handles data.
2. **Middleware Chains**: Understanding the flow of `next()`.
3. **Error Handling**: Creating global error-handling middleware.
4. **RESTful API Patterns**: Best practices for HTTP methods and status codes.
5. **Security**: Protecting against common vulnerabilities (XSS, CSRF).

## 🙈 Ignored Files
To keep the repository clean and protect sensitive information, several files and directories are ignored via `.gitignore`:
- **Dependencies**: `node_modules/`
- **Environment Variables**: `.env` and other secret files.
- **Logs**: Various log files (e.g., `npm-debug.log`).
- **Images & Media**: Common image formats like `.png`, `.jpeg`, and `.jpg` are excluded to maintain a lightweight repository.

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.