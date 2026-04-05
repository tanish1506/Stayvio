const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const dashboardController = require("../controllers/dashboard");
const {isLoggedIn , isHost} = require("../middlewares");

router.get('/dashboard' , isLoggedIn, isHost, wrapAsync(dashboardController.getHostDashboard));

module.exports = router;