const userService = require("../services/userService");
const { userDTO } = require("../utils/userDTO");

exports.createUser = async (req, res) => {
  try {
    const { username, email, dob, password } = req.body;
    const newUser = await userService.createUser({ username, email, dob, password });
    const userResponse = userDTO(newUser);
    return res.status(201).json({ users: userResponse });

  } catch (error) {
    let statusCode = 500;
    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.errors.map(e => e.message);
      statusCode = 400;
    } else if (error.name === "SequelizeUniqueConstraintError") {
      errors = ["Email already in use"];
      statusCode = 409;
    } else if (error.name === "SequelizeConnectionRefusedError") {
      errors = ["Database connection failed"];
      statusCode = 503;
    } else {
      errors = [error.message || "Unknown error"];
    }

    return res.status(statusCode).json({ errors });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({
        errors: ["Page or limit is not defined properly."]
      });
    }

    const result = await userService.getAllUsers(page, limit);
    res.status(200).json(result);

  } catch (error) {
    console.error("Get All Users Error:", error.name, error.message);

    if (error.name === "SequelizeConnectionError") {
      return res.status(503).json({
        errors: ["Database connection failed"]
      });
    }

    res.status(500).json({
      errors: ["Failed to retrieve users"]
    });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ error: "Invalid or missing user ID" });
    }
    const user = await userService.getUserById(userId);
    res.status(200).json(user);

  } catch (error) {
    console.error("Get User By ID Error:", error.name, error.message);


    if (error.name === "SequelizeDatabaseError") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};