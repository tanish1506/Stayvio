const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const adminController = require("../controllers/admin");
const { isLoggedIn , isAdmin } = require("../middlewares");

router.get("/admin",isLoggedIn , isAdmin , wrapAsync(adminController.getAdminDashboard));

router.delete("/admin/users/:id",isLoggedIn, isAdmin,wrapAsync(adminController.deleteUser));

module.exports = router;