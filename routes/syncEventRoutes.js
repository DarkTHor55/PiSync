const express = require("express");
const router = express.Router();
const syncEventController = require("../controller/syncEventController");

router.post("/sync-event", syncEventController.createSyncEvent);
router.get("/device/:id/sync-history", syncEventController.getSyncHistory);

module.exports = router;