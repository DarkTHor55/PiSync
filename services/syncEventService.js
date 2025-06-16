const { SyncEvent, Device, User } = require("../models");
const NotificationService = require("./NotificationService");

exports.createSyncEvent = async (data) => {
  const { deviceId, totalFilesSynced, totalError, internetSpeed } = data;

  const status = totalError > 0 ? false : true;
  if (totalError > 2) {
    NotificationService.notifyRepeatedFailure(deviceId, totalError);

  }
  const syncEvent = await SyncEvent.create({
    deviceId,
    totalFilesSynced,
    totalError,
    internetSpeed,
    status,
    createdAt: new Date(),
  });

  if (!status) {
    const device = await Device.findByPk(deviceId, { include: [User] });

    if (device) {
      device.status += 1;
      await device.save();


    }
  }


  return syncEvent;
};

exports.getSyncHistory = async (deviceId, page = 1, limit = 10) => {
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
};
