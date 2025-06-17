const deviceService = require("../services/deviceService");


exports.createDevice = async (req, res) => {
  try {
    const { type, userId, deviceName } = req.body;

    if (!type || !userId || !deviceName) {
      return res.status(400).json({ error: "Type, userId, and deviceName are required." });
    }

    const newDevice = await deviceService.createDevice({ type, userId, deviceName });
    res.status(201).json({ data: newDevice });

  } catch (error) {
    res.status(error.statusCode).json({ errors: [error.message] });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ errors: ["Page or limit is not defined properly."] });
    }

    const result = await deviceService.getAllDevicesPaginated(page, limit);
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Get All Devices Error:", error.message);
    res.status(error.statusCode || 500).json({
      errors: [error.message || "Failed to fetch devices"],
    });
  }
};
exports.getDevicesWithFailures = async (req, res) => {
  try {
    const devices = await deviceService.getDevicesWithFailures();
    res.status(200).json({ data: devices });
  } catch (error) {
    console.error("Fetch Failed Devices Error:", error.message);
    res.status(error.statusCode || 500).json({
      errors: [error.message || "Failed to fetch devices"],
    });
  }
};
exports.getDeviceById = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await deviceService.getDeviceById(deviceId);
    res.status(200).json({ data: device });
  } catch (error) {
    console.error("Get Device By ID Error:", error.message);

    if (error.message === "Device not found") {
      return res.status(404).json({ errors: [error.message] });
    }

    res.status(error.statusCode || 500).json({
      errors: [error.message || "Failed to retrieve device"],
    });
  }
};
