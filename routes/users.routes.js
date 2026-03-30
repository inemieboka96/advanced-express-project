import express from "express";

const router = express.Router();

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
router.get("/search", (req, res) => {
  // Destruct req.query data
  const { id, username, email, role, age } = req.query;
  let filteredData = users; // Prevents original data from mutating
  // Filter the data accordingly

  if (id) {
    // Edge Case; Non-Numerical user ID
    if (isNaN(parseInt(id)))
      return res.status(400).json({ error: "ID must be a number" });

    filteredData = filteredData.filter(
      (user) => parseInt(user.id) === parseInt(id),
    );
  }

  if (username) {
    filteredData = filteredData.filter(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  if (email) {
    filteredData = filteredData.filter(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  if (role) {
    filteredData = filteredData.filter(
      (user) => user.role.toLowerCase() === role.toLowerCase(),
    );
  }

  if (age) {
    filteredData = filteredData.filter(
      (user) => parseInt(user.age) === parseInt(age),
    );
  }

  // Edge Case: No matches after filtering
  if (filteredData.length === 0)
    return res.status(404).json({ error: "No users matching criteria" });

  // Return filtered data
  res.json(filteredData);
});

// GET /api/users/:id - Get Specific User
router.get("/:id", (req, res) => {
  // Search for specific user
  const user = users.find((user) => user.id === parseInt(req.params.id));

  if (user) {
    // If user found
    res.json(user); // Return User Data
  } else {
    // Return Error 404 - Not Found
    res.status(404).json({ error: `User ${req.params.id} not found` });
  }
});

/*
    POST REQUESTS
*/

// POST /api/users - Add new User
router.post("/", (req, res) => {
  const { username, email, role, age } = req.body;

  // Validation of required fields
  if (!username && !email)
    return res.status(400).json({ error: "Username and Email are required" });

  // Create New User
  const newUser = {
    id: users.length > 0 ? users.at(-1).id + 1 : 1,
    username: username,
    email: email,
    role: role || "user", // Default to user if none is provided
    age: parseInt(age) || 0,
  };

  users.push(newUser); // Add new user record to sample DB collection

  res.status(201).json(newUser); // Give response status code of 200 and return new data
});

/*
  PUT REQUESTS
*/

router.put("/:id", (req, res) => {
  // Find index of specific user
  const userIndex = users.findIndex(
    (user) => user.id === parseInt(req.params.id),
  );
  // If not found
  if (!userIndex) return res.status(404).json({ error: "User not found" });

  // Destruct request body
  const { username, email, role, age } = req.body;

  // Update specific user's data
  users[userIndex] = {
    id: parseInt(req.params.id),
    username: username,
    email: email,
    role: role || "user",
    age: parseInt(age),
  };
  // Return Code 200 - Ok
  res.status(200).json(users[userIndex]);
});

/*
  PATCH REQUESTS
*/

router.patch("/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  if (req.body.id) delete req.body.id; // Prevents changes to ID
  if (req.body.age) req.body.age = parseInt(req.body.age); // Typecast to int
  Object.assign(user, req.body); // Update the specific user's data for the
  res.status(200).json(user); // Return Status code 200 - Ok
});

/*
  DELETE REQUESTS
*/

router.delete("/:id", (req, res) => {
  const index = users.findIndex((user) => user.id === parseInt(req.params.id)); // Find user to delete in data
  if (index === -1) return res.status(404).json({ error: "User ID not found" }); // If not found return error
  const [deletedUser] = users.splice(index, 1); // Delete specific user & store deleted record in variable

  res.status(200).json(deletedUser); // Return the deleted user
});

export default router;
