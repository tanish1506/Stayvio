const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const dashboardController = require("../controllers/dashboard");
const {isLoggedIn } = require("../middlewares");

router.get('/dashboard' , isLoggedIn, wrapAsync(dashboardController.getHostDashboard));

module.exports = router;