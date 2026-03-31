import express from "express";
import { body, query, param } from "express-validator";
import { handleValidations } from "../middleware/validator.middleware.js";

const router = express.Router();

const ACCEPTABLE_ROLES = ["user", "admin", "moderator", "editor"];

// Sample Data
const users = [
  {
    id: 1,
    username: "alex_pro",
    email: "alex.pro@example.com",
    role: "admin",
    age: 30,
  },
  {
    id: 2,
    username: "sarah_j",
    email: "sarah.j@example.com",
    role: "user",
    age: 26,
  },
  {
    id: 3,
    username: "mike_coder",
    email: "mike.c@example.com",
    role: "moderator",
    age: 45,
  },
  {
    id: 4,
    username: "emily_w",
    email: "emily.w@example.com",
    role: "user",
    age: 13,
  },
  {
    id: 5,
    username: "chris_t",
    email: "chris.t@example.com",
    role: "user",
    age: 16,
  },
  {
    id: 6,
    username: "jessica_r",
    email: "jessica.r@testmail.com",
    role: "editor",
    age: 22,
  },
  {
    id: 7,
    username: "ryan_dev",
    email: "ryan.dev@example.com",
    role: "user",
    age: 34,
  },
  {
    id: 8,
    username: "laura_b",
    email: "laura.b@provider.com",
    role: "admin",
    age: 29,
  },
  {
    id: 9,
    username: "kevin_s",
    email: "kevin.s@example.com",
    role: "user",
    age: 41,
  },
  {
    id: 10,
    username: "olivia_m",
    email: "olivia.m@test.com",
    role: "moderator",
    age: 37,
  },
];

/*
    GET REQUESTS
*/

// GET /api/users - Returns all Users
router.get("/", (req, res) => {
  res.send(users);
});

// GET /api/users/search? - Searching for specific data
router.get(
  "/search",
  [
    // Rules
    query("id").optional().isInt().toInt(),
    query("username")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Search term cannot be empty"),
    query("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Must be a valid email format")
      .normalizeEmail(),
    query("age").optional().isInt({ min: 0 }).toInt(),
    query("role").optional().trim().toLowerCase().isIn(ACCEPTABLE_ROLES),
    handleValidations,
  ],
  (req, res) => {
    const { id, username, email, role, age } = req.query;
    let filteredData = users;

    if (id) filteredData = filteredData.filter((u) => u.id === id);

    if (username) {
      filteredData = filteredData.filter((u) =>
        u.username.toLowerCase().includes(username.toLowerCase()),
      );
    }

    if (email) filteredData = filteredData.filter((u) => u.email === email);
    if (role) filteredData = filteredData.filter((u) => u.role === role);
    if (age) filteredData = filteredData.filter((u) => u.age === age);

    if (filteredData.length === 0)
      return res.status(404).json({ error: "No matches found" });
    res.json(filteredData);
  },
);

// GET /api/users/:id - Get Specific User
router.get(
  "/:id",
  [
    param("id").isInt().withMessage("ID must be a number").toInt(),
    handleValidations,
  ],
  (req, res) => {
    const user = users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  },
);

/*
    POST REQUESTS
*/

// POST /api/users - Add new User
router.post(
  "/",
  [
    // Rules
    body("username").notEmpty().withMessage("Username is Required").trim(),
    body("email")
      .isEmail()
      .withMessage("Must be a Valid Email")
      .normalizeEmail(),
    body("age")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Age must be positive"),
  ],
  handleValidations,
  (req, res) => {
    const { username, email, role, age } = req.body;

    // Create New User
    const newUser = {
      id: users.length > 0 ? users.at(-1).id + 1 : 1,
      username: username,
      email: email,
      role: role || "user", // Default to user if none is provided
      age: age || 0,
    };

    users.push(newUser); // Add new user record to sample DB collection

    res.status(201).json(newUser); // Give response status code of 200 and return new data
  },
);

/*
  PUT REQUESTS
*/

// PUT /api/users/:id - Completely replace existing user object
router.put(
  "/:id",
  [
  param("id").isInt().toInt(),
  body("username").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("age").isInt({ min: 0 }).toInt(),
  body("role").isIn(['user', 'admin', 'moderator', 'editor']),
  handleValidations
],
  (req, res) => {
    // Find index of specific user
    const userIndex = users.findIndex(
      (user) => user.id === req.params.id,
    );
    // If not found
    if (userIndex === -1)
      return res.status(404).json({ error: "User not found" });

    // Destruct request body
    const { username, email, role, age } = req.body;

    // Update specific user's data
    users[userIndex] = {
      id: req.params.id,
      username: username,
      email: email,
      role: role,
      age: age,
    };
    // Return Code 200 - Ok
    res.status(200).json(users[userIndex]);
  },
);

/*
  PATCH REQUESTS
*/

// PATCH /api/users/:id - Partial update of user object
router.patch("/:id", [
  param("id").isInt().toInt(),
  body("username").optional().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("age").optional().isInt({ min: 0 }).toInt(),
  handleValidations
], (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.body.id) delete req.body.id; // Protect the ID from being changed
  // Update only the fields provided in the body
  Object.assign(user, req.body);
  res.json(user);
});

/*
  DELETE REQUESTS
*/

// DELETE /api/users/:id - Delete User Object
router.delete("/:id", [
  param("id").isInt().withMessage("Invalid ID format").toInt(),
  handleValidations
], (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  const [deletedUser] = users.splice(index, 1);
  res.json(deletedUser);
});

export default router;
