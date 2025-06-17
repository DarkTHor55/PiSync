const { User } = require("../models");
const { CustomException } = require("../Exception/CustomException");

exports.createUser = async (userData) => {

  if (userData.email == null) {
    throw new CustomException("Email Not Found");
  }
  const existingUser = await User.findOne({ where: { email: userData.email } });

  if (existingUser != null) {
    throw new CustomException("User Already Exist");
  }
  const newUser = await User.create(userData);
  return newUser;
};



exports.getAllUsers = async (page, limit) => {


  const offset = (page - 1) * limit;

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
};

exports.getUserById = async (id) => {

  try {
    const user = await User.findByPk(id);

    if (!user) {
      res.status(400).json({ error: "User Not Found" });
    }

    return user;
  } catch (error) {
    if (error.name === "SequelizeDatabaseError") {
      throw new Exception("Invalid user ID format", 400);
    }

    throw new Exception("Something went wrong while fetching user", 500);
  }
};
