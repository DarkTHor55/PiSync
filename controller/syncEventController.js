const syncEventService = require("../services/syncEventService");

exports.createSyncEvent = async (req, res) => {
  try {
    const syncEvent = await syncEventService.createSyncEvent(req.body);
    res.status(201).json(syncEvent);
  } catch (error) {
    console.error("Sync Event Create Error:", error.message);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ error: "Validation Error", details: messages });
    }

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ error: "Database Error", details: error.message });
    }

    res.status(error.statusCode || 500).json({
      error: error.message || "Failed to create sync event"
    });
  }
};

exports.getSyncHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
     if ( page <1 || limit < 1) {
      return res.status(400).json({ error: "Page or limit is not defined properly." });
    }

    const result = await syncEventService.getSyncHistory(id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get Sync History Error:", error);
    res.status(500).json({ error: "Failed to fetch sync history" });
  }
};
