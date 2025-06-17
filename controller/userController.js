const userService = require("../services/userService");
const { userDTO } = require("../utils/userDTO");

exports.createUser = async (req, res) => {
  try {
    const { username, email, dob, password } = req.body;
    const newUser = await userService.createUser({ username, email, dob, password });
    const userResponse = userDTO(newUser);
    return res.status(201).json({ data: userResponse });

  } catch (error) {
    let statusCode = 500;
    let errors = [];

    switch (error.name) {
      case "SequelizeValidationError":
        errors = error.errors.map(e => e.message);
        statusCode = 400;
        break;

      case "SequelizeUniqueConstraintError":
        errors = ["Email already in use"];
        statusCode = 409;
        break;

      case "SequelizeConnectionRefusedError":
        errors = ["Database connection failed"];
        statusCode = 503;
        break;

      default:
        errors = [error.message || "Unknown error"];
        break;
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
    return res.status(200).json({ data: result });

  } catch (error) {
    console.error("Get All Users Error:", error.name, error.message);

    const errors = [error.name === "SequelizeConnectionError"
      ? "Database connection failed"
      : error.message || "Failed to retrieve users"
    ];

    return res.status(500).json({ errors });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ errors: ["Invalid or missing user ID"] });
    }

    const user = await userService.getUserById(userId);
    return res.status(200).json({ data: user });

  } catch (error) {
    console.error("Get User By ID Error:", error.name, error.message);

    let statusCode = 500;
    let errors = [];

    if (error.name === "SequelizeDatabaseError") {
      errors = ["Invalid user ID format"];
      statusCode = 400;
    } else if (error.message === "User not found") {
      errors = [error.message];
      statusCode = 404;
    } else {
      errors = [error.message || "Failed to retrieve user"];
    }

    return res.status(statusCode).json({ errors });
  }
};
