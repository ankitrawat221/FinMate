const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, dashboardController.summary);
router.get("/analytics", authMiddleware, dashboardController.analytics);
router.get("/recent-transactions", authMiddleware, dashboardController.summary);
router.get("/upcoming-bills", authMiddleware, dashboardController.summary);

module.exports = router;
