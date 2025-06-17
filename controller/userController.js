const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  try {
    const { username, email, dob, password } = req.body;
    const newUser = await userService.createUser({ username, email, dob, password });

    res.status(201).json({ users: newUser });

  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ errors: messages });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email already in use" });
    }

    if (error.name === "SequelizeConnectionRefusedError") {
      return res.status(503).json({ error: "Database connection failed" });
    }

    return res.status(500).json({ error: error.message || "Unknown error" });

  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ error: "Page or limit is not defined properly." });
    }
    const result = await userService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get All Users Error:", error.name, error.message);

    if (error.name === "SequelizeConnectionError") {
      return res.status(503).json({ error: "Database connection failed" });
    }

    res.status(500).json({ error: "Failed to retrieve users" });
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