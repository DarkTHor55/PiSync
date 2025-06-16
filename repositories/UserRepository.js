const { User } = require("../models");

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id);
  }
// future use
  async findAll() {
    return await User.findAll();
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }
}

module.exports = new UserRepository();
