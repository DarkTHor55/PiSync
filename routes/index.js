const express = require("express");
const router = express.Router();

router.use("/", require("./userRoutes"));
router.use("/", require("./deviceRoutes"));
router.use("/", require("./syncEventRoutes"));

module.exports = router;