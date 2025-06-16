const express = require("express");
const router = express.Router();
const deviceController = require("../controller/deviceController");

router.post("/device", deviceController.createDevice);
router.get("/devices", deviceController.getAllDevices);
router.get('/devices/repeated-failures', deviceController.getDevicesWithFailures);
router.get('/device/:id', deviceController.getDeviceById);

module.exports = router;
