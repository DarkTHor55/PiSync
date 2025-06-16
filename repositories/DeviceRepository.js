const { Device } = require("../models");

class DeviceRepository {
  async create(deviceData) {
    return await Device.create(deviceData);
  }

  async findById(id) {
    return await Device.findByPk(id);
  }

  async findFailedDevices() {
    return await Device.findAll({ where: { failed: true } });
  }
  // future use
  async findByUserId(userId) {
    return await Device.findAll({ where: { userId } });
  }

}

module.exports = new DeviceRepository();
