const userService = require("../services/userService");

exports.createUser = async (req, res) => {
  try {
    const { username, email, dob, password } = req.body;
    const newUser = await userService.createUser({ username, email, dob, password });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Create User Error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Get User By ID Error:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};
