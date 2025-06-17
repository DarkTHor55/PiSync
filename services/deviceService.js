const { Device, User, SyncEvent } = require("../models");
const { Op, ValidationError, DatabaseError } = require("sequelize");

exports.createDevice = async (deviceData) => {
  const { type, userId, deviceName } = deviceData;

  try {
    const user = await User.findByPk(userId);
    console.log(user)
    if (user == null) {
      const err = new Error("User Id is not valid.");
      err.statusCode = 400;
      throw err
    }

    const existingDevice = await Device.findOne({
      where: { type, userId, deviceName }
    });


    if (existingDevice) {
      const err = new Error("Device already exists for this user.");
      err.statusCode = 409;
      throw err;
    }

    const newDevice = await Device.create(deviceData);
    return newDevice;

  } catch (error) {

    if (error instanceof ValidationError) {
      const messages = error.errors.map(e => e.message);
      const err = new Error(messages.join(", "));
      err.statusCode = 400;
      throw err;
    }

    if (error instanceof DatabaseError) {
      const err = new Error("Database error: " + error.message);
      err.statusCode = 400;
      throw err;
    }

    if (error.statusCode === 409) {
      throw error;
    }
    const err = new Error("Failed to create device.");
    err.statusCode = 500

    throw err;
  }
};

exports.getAllDevicesPaginated = async (page, limit) => {
  const offset = (page - 1) * limit;

  try {
    const result = await Device.findAndCountAll({
      include: [{ model: User, attributes: ["userId", "username", "email"], foreignKey: "userId" }],
      limit,
      offset,
    });
    return result;
  } catch (error) {
    const err = new Error("Database error: " + error.message);
    err.statusCode = 500;
    throw err;
  }
};



exports.getDevicesWithFailures = async () => {
  try {
    const devices = await Device.findAll({
      where: {
        FailedCount: {
          [Op.gte]: 3,
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

    return devices;

  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map(e => e.message);
      const err = new Error("Validation Error: " + messages.join(", "));
      err.statusCode = 400;
      throw err;
    }

    if (error instanceof DatabaseError) {
      const err = new Error("Database Error: " + error.message);
      err.statusCode = 502;
      throw err;
    }

    const err = new Error("Unexpected error while fetching devices with failures.");
    err.statusCode = 500;
    throw err;
  }
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