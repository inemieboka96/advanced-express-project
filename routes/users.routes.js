import express from "express";
import { checkSchema } from "express-validator";
import { handleValidations } from "../middleware/validator.middleware.js";
import { users } from "../sampleData.js";
import {
  userValidationSchema,
  userSearchSchema,
  idParamSchema,
} from "../utils/validationSchemas.js";

const router = express.Router();

// Local copy to avoid mutating original sample data
let usersData = [...users];

/*
    GET REQUESTS
*/

// GET /api/users - Returns all Users
router.get("/", (req, res) => {
  res.send(usersData);
});

// GET /api/users/search - Searching for specific data
router.get(
  "/search",
  checkSchema(userSearchSchema),
  handleValidations,
  (req, res) => {
    const { id, username, email, role, age } = req.query;
    let filteredData = usersData;

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
  checkSchema(idParamSchema),
  handleValidations,
  (req, res) => {
    // req.params.id is already an integer from schema toInt: true
    const user = usersData.find((u) => u.id === req.params.id);
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
  checkSchema(userValidationSchema),
  handleValidations,
  (req, res) => {
    const { username, email, role, age } = req.body;

    const newUser = {
      id: usersData.length > 0 ? usersData.at(-1).id + 1 : 1,
      username,
      email,
      role: role || "user",
      age: age || 0,
    };

    usersData.push(newUser);
    res.status(201).json(newUser);
  },
);

/*
    PUT REQUESTS
*/

// PUT /api/users/:id - Completely replace existing user object
router.put(
  "/:id",
  checkSchema(idParamSchema),
  checkSchema(userValidationSchema),
  handleValidations,
  (req, res) => {
    const userIndex = usersData.findIndex((u) => u.id === req.params.id);

    if (userIndex === -1)
      return res.status(404).json({ error: "User not found" });

    const { username, email, role, age } = req.body;

    usersData[userIndex] = {
      id: req.params.id,
      username,
      email,
      role,
      age,
    };

    res.status(200).json(usersData[userIndex]);
  },
);

/*
    PATCH REQUESTS
*/

// PATCH /api/users/:id - Partial update
router.patch(
  "/:id",
  checkSchema(idParamSchema),
  // Modify schema to allow optional fields
  checkSchema(
    Object.fromEntries(
      Object.entries(userValidationSchema).map(([key, value]) => [
        key,
        { ...value, optional: true },
      ]),
    ),
  ),
  handleValidations,
  (req, res) => {
    const user = usersData.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.body.id) delete req.body.id;
    Object.assign(user, req.body);
    res.json(user);
  },
);

/*
    DELETE REQUESTS
*/

// DELETE /api/users/:id
router.delete(
  "/:id",
  checkSchema(idParamSchema),
  handleValidations,
  (req, res) => {
    const index = usersData.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    const [deletedUser] = usersData.splice(index, 1);
    res.json(deletedUser);
  },
);

export default router;