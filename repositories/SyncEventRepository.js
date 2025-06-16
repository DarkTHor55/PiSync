const { SyncEvent } = require("../models");

class SyncEventRepository {
  async create(eventData) {
    return await SyncEvent.create(eventData);
  }

  async getByDeviceId(deviceId) {
    return await SyncEvent.findAll({ where: { deviceId } });
  }

  async getRecentEvents(limit = 10) {
    return await SyncEvent.findAll({ limit, order: [["timestamp", "DESC"]] });
  }

  async getFailedEventsByDevice(deviceId) {
    return await SyncEvent.findAll({
      where: { deviceId, status: "FAILED" },
    });
  }
}

module.exports = new SyncEventRepository();
