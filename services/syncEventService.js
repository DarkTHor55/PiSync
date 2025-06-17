const { SyncEvent, Device, User } = require("../models");
const NotificationService = require("./NotificationService");
const { Op } = require("sequelize");


exports.createSyncEvent = async (data) => {
  try {
    const { deviceId, totalFileSynced, totalError, internetSpeed } = data;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let syncEvent = await SyncEvent.findOne({
      where: {
        deviceId,
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    const device = await Device.findByPk(deviceId, { include: [User] });

    if (!device) {
      const err = new Error("Device not found");
      err.statusCode = 404;
      throw err;
    }

    if (syncEvent) {
      syncEvent.totalFileSynced = totalFileSynced;
      syncEvent.totalError = totalError;
      syncEvent.internetSpeed = internetSpeed;
      syncEvent.updatedAt = new Date();
      await syncEvent.save();
    } else {
      syncEvent = await SyncEvent.create({
        deviceId,
        totalFileSynced,
        totalError,
        internetSpeed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

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
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map(e => e.message);
      const err = new Error("Validation Error: " + messages.join(", "));
      err.statusCode = 400;
      throw err;
    }

    const err = new Error("Failed to create/update sync event.");
    err.statusCode = 500;
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
    if (error instanceof ValidationError) {
      const messages = error.errors.map(e => e.message);
      const err = new Error("Validation Error: " + messages.join(", "));
      err.statusCode = 400;
      throw err;
    }

    if (error instanceof DatabaseError) {
      const err = new Error("Database Error: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    const err = new Error(error.message || "Failed to fetch sync history.");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

