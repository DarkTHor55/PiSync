const { SyncEvent, Device, User } = require("../models");
const NotificationService = require("./NotificationService");
const { Op } = require("sequelize");

exports.createSyncEvent = async (data) => {
  try {
    const { deviceId, totalFileSynced, totalError, internetSpeed } = data;

    const device = await Device.findByPk(deviceId);

    if (!device) {
      const err = new Error("Device not found");
      err.statusCode = 404;
      throw err;
    }

    const syncEvent = await SyncEvent.create({
      deviceId,
      totalFileSynced,
      totalError,
      internetSpeed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (totalError > 0) {
      device.FailedCount += 1;
      device.consecutiveFailures += 1;

      if (device.consecutiveFailures >= 3) {
        NotificationService.notifyRepeatedFailure(deviceId, device.consecutiveFailures);
      }
    } else {
      device.consecutiveFailures = 0;
    }
    await device.save();
    return syncEvent;
  } catch (error) {
    console.log(error);
    const err = new Error(error.message);
    err.statusCode = error.statusCode || 500;
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map(e => e.message);
      err.message = "Validation Error: " + messages.join(", ");
      err.statusCode = 400;
    }
    throw err;
  }
};


exports.getSyncHistory = async (deviceId, page, limit) => {
  try {
    if (!deviceId) {
      const err = new Error("Device ID is required.");
      err.statusCode = 400;
      throw err;
    }

    const offset = (page - 1) * limit;

    const syncLogs = await SyncEvent.findAndCountAll({
      where: { deviceId },
      order: [["timestamp", "DESC"]],
      limit,
      offset,
    });

    return {
      syncLogs,
    };

  } catch (error) {
    const err = new Error(error.message || "Failed to fetch sync history.");
    err.statusCode = error.statusCode || 500;
    if (error instanceof ValidationError) {
      const messages = error.errors.map(e => e.message);
      err.message = new Error("Validation Error: " + messages.join(", "));
      err.statusCode = 400;
    }

    if (error instanceof DatabaseError) {
      err.message = new Error("Database Error: " + error.message);
      err.statusCode = 500;
    }
    throw err;
  }
};