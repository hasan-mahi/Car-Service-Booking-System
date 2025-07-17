const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const { authenticateToken, checkAccess } = require("../utils/grantAccess");
const { asyncHandler } = require("../utils/errorHandler");
const { validateMiddleware } = require("../utils/validate");
const { vehicleSchema } = require("../validators/vehicleValidator"); // import your Joi schema

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

// Validate request body on create
router.post(
  "/",
  authenticateToken,
  checkAccess("vehicle", "can_create"),
  validateMiddleware(vehicleSchema),
  asyncHandler(vehicleController.create)
);

// Validate request body on update
router.put(
  "/:id",
  authenticateToken,
  checkAccess("vehicle", "can_update"),
  validateMiddleware(vehicleSchema),
  asyncHandler(vehicleController.update)
);

router.delete(
  "/:id",
  authenticateToken,
  checkAccess("vehicle", "can_delete"),
  asyncHandler(vehicleController.delete)
);

module.exports = router;
