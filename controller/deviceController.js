const deviceService = require("../services/deviceService");


exports.createDevice = async (req, res) => {
  try {
    const { type, userId, deviceName } = req.body;

    if (!type || !userId || !deviceName) {
      return res.status(400).json({ error: "Type, userId, and deviceName are required." });
    }

    const newDevice = await deviceService.createDevice({ type, userId, deviceName });
    res.status(201).json(newDevice);

  } catch (error) {
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.message === "Device already exists"
    ) {
      return res.status(409).json({ error: "Device already exists for this user." });
    }

    if (
      error.name === "SequelizeForeignKeyConstraintError" ||
      error.message === "insert or update on table violates foreign key constraint"
    ) {
      return res.status(400).json({ error: "Invalid userId. User does not exist." });
    }

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ error: messages });
    }

    res.status(500).json({ error: "Failed to create device" });
  }
};


exports.getAllDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Page or limit is not defined properly." });
    }
    const result = await deviceService.getAllDevicesPaginated(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get All Devices Error:", error);

    res.status(error.statusCode || 500).json({
      error: error.message || "Failed to fetch devices",
    });
  }
};

exports.getDevicesWithFailures = async (req, res) => {
  try {
    const devices = await deviceService.getDevicesWithFailures();
    res.status(200).json(devices);
  } catch (error) {
    console.error("Fetch Failed Devices Error:", error.message);
    res.status(error.statusCode || 500).json({
      error: error.message || "Failed to fetch devices"
    });
  }
};



exports.getDeviceById = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await deviceService.getDeviceById(deviceId);
    res.status(200).json(device);
  } catch (error) {
    if (error.message === "Device not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Get Device By ID Error:", error);
    res.status(500).json({ error: "Failed to retrieve device" });
  }
};
