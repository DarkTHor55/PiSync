const syncEventService = require("../services/syncEventService");

exports.createSyncEvent = async (req, res) => {
  try {
    const syncEvent = await syncEventService.createSyncEvent(req.body);
    res.status(201).json(syncEvent);
  } catch (error) {
    console.error("Sync Event Create Error:", error);
    res.status(500).json({ error: "Failed to create sync event" });
  }
};

exports.getSyncHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await syncEventService.getSyncHistory(id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get Sync History Error:", error);
    res.status(500).json({ error: "Failed to fetch sync history" });
  }
};
