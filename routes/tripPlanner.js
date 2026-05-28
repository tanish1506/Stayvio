const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const tripPlannerController = require("../controllers/tripPlanner");
const { validateTripPlan, isLoggedIn, isTripPlanOwner} = require("../middlewares");

//Form show
router.get("/new",isLoggedIn,wrapAsync(tripPlannerController.newForm));

//form submit - AI plan generation
router.post("/",isLoggedIn,validateTripPlan,wrapAsync(tripPlannerController.createPlan));

// PDF download export route
router.get("/:id/export/pdf", isLoggedIn , isTripPlanOwner , wrapAsync(tripPlannerController.exportPdf));

//patch toggle share on/off
router.patch("/:id/share",isLoggedIn , isTripPlanOwner, wrapAsync(tripPlannerController.toggleShare));

//get share token public view 
router.get("/share/:token",wrapAsync(tripPlannerController.shareView));

// plan dikhao
router.get("/:id", isLoggedIn , isTripPlanOwner , wrapAsync(tripPlannerController.showPlan));

// PLan saving
router.patch("/:id/save",isLoggedIn, isTripPlanOwner , wrapAsync(tripPlannerController.savePlan));

//regenerate
router.patch("/:id/regenerate",isLoggedIn, isTripPlanOwner,wrapAsync(tripPlannerController.regeneratePlan));

// Plan delete
router.delete("/:id",isLoggedIn, isTripPlanOwner , wrapAsync(tripPlannerController.deletePlan));


module.exports = router;