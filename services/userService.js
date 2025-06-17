const { User } = require("../models");
const { ValidationError, DatabaseError } = require("sequelize");

exports.createUser = async (userData) => {
  try {
    if (!userData.email) {
      const err = new Error("Email is required.");
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await User.findOne({ where: { email: userData.email } });

    if (existingUser) {
      const err = new Error("User already exists with this email.");
      err.statusCode = 409;
      throw err;
    }

    const newUser = await User.create(userData);
    return newUser;

  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map(e => e.message);
      const err = new Error(messages.join(", "));
      err.statusCode = 400;
      throw err;
    }

    if (error instanceof DatabaseError) {
      const err = new Error("Database error: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    if (error.statusCode === 409 || error.statusCode === 400) {
      throw error;
    }

    const err = new Error("Failed to create user.");
    err.statusCode = 500;
    throw err;
  }
};
exports.getAllUsers = async (page, limit) => {
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
    });

    return {
      users: rows,
      totalUsers: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };

  } catch (error) {
    const err = new Error("Database error: " + error.message);
    err.statusCode = 500;
    throw err;
  }
};
exports.getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }

    return user;

  } catch (error) {
    if (error instanceof DatabaseError) {
      const err = new Error("Invalid user ID format.");
      err.statusCode = 400;
      throw err;
    }

    const err = new Error("Something went wrong while fetching the user.");
    err.statusCode = 500;
    throw err;
  }
};
