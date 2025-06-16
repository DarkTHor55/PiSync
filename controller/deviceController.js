const deviceService = require("../services/deviceService");

exports.createDevice = async (req, res) => {
  try {
    const { type, userId,deviceName } = req.body;
    const newDevice = await deviceService.createDevice({ type, userId,deviceName });
    res.status(201).json(newDevice);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ error: error.message });
    }

    console.error("Create Device Error:", error);
    res.status(500).json({ error: "Failed to create device" });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await deviceService.getAllDevicesPaginated(page, limit);

    res.status(200).json(result);
  } catch (error) {
    console.error("Get All Devices Error:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

exports.getDevicesWithFailures = async (req, res) => {
  try {
    const devices = await deviceService.getDevicesWithFailures();
    res.json(devices);
  } catch (error) {
    console.error("Fetch Failed Devices Error:", error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};


exports.getDeviceById = async (req, res) => {
  try {
    const deviceId = req.params.id;
    console.log(deviceId);
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
