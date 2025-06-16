const { Device, User, SyncEvent } = require("../models");
const { Op } = require("sequelize");


exports.createDevice = async (deviceData) => {
  const { type, userId ,deviceName} = deviceData;

  const existingDevice = await Device.findOne({
    where: { type, userId ,deviceName}
  });

  if (existingDevice) {
    const err = new Error("Device already exists for this user.");
    err.statusCode = 409;
    throw err;
  }
  const newDevice = await Device.create(deviceData);
  return newDevice;
};

exports.getAllDevicesPaginated = async (page, limit) => {
  const offset = (page - 1) * limit;

  const result = await Device.findAndCountAll({
    include: [{ model: User, attributes: ["userId", "username", "email"], foreignKey: "userId" }],
    limit,
    offset,
  });

  return {
    result,
  };
};



exports.getDevicesWithFailures = async () => {
  return await Device.findAll({
    where: {
      status: {
        [Op.gte]: 3, // Greater than or equal to 3
      },
    },
    include: [
      {
        model: User,
        attributes: ['userId', 'username', 'email']
      },
      {
        model: SyncEvent
      }
    ]
  });
};

exports.getDeviceById = async (deviceId) => {
  const device = await Device.findByPk(deviceId, {
    include: [
      {
        model: User,
        attributes: ["userId", "username", "email"]
      },
      {
        model: SyncEvent
      }
    ]
  });

  if (!device) {
    throw new Error("Device not found");
  }

  return device;
};