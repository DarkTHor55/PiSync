const { User } = require("../models");

exports.createUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const newUser = await User.create(userData);
  return newUser;
};

exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
