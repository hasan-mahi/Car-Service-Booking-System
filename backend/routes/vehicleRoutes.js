const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const {
  authenticateToken,
  checkAccess,
} = require("../utils/grantAccess");
const { asyncHandler } = require("../utils/errorHandler"); // import asyncHandler

router.get(
  "/",
  authenticateToken,
  checkAccess("vehicle", "can_read"),
  asyncHandler(vehicleController.getAll)
);

router.get(
  "/:id",
  authenticateToken,
  checkAccess("vehicle", "can_read"),
  asyncHandler(vehicleController.getById)
);

router.post(
  "/",
  authenticateToken,
  checkAccess("vehicle", "can_create"),
  asyncHandler(vehicleController.create)
);

router.put(
  "/:id",
  authenticateToken,
  checkAccess("vehicle", "can_update"),
  asyncHandler(vehicleController.update)
);

router.delete(
  "/:id",
  authenticateToken,
  checkAccess("vehicle", "can_delete"),
  asyncHandler(vehicleController.delete)
);

module.exports = router;
