// Logger Middleware
export const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`); // e.g. GET api/users
  next(); // Call the next middleware function
};