const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, checkAccess } = require("../utils/grantAccess");
const { asyncHandler } = require("../utils/errorHandler");
const { validateMiddleware } = require("../utils/validate"); // <-- Import here
const { registerSchema, loginSchema } = require("../validators/userValidator"); // <-- Your Joi schemas

// Public routes with validation
router.post(
  "/register",
  validateMiddleware(registerSchema),
  asyncHandler(userController.registerUser)
);

router.post(
  "/login",
  validateMiddleware(loginSchema),
  asyncHandler(userController.loginUser)
);

// Protect all routes below this
router.use(authenticateToken);

// Protected user routes
router.get("/", checkAccess("user", "can_read"), asyncHandler(userController.getAllUsers));
router.put("/:id", checkAccess("user", "can_update"), asyncHandler(userController.updateUser));
router.delete("/:id", checkAccess("user", "can_delete"), asyncHandler(userController.deleteUser));

// Role management
router.get("/roles", checkAccess("role", "can_read"), asyncHandler(userController.getRoles));

// Access management
router.get("/accesses/:role_id", checkAccess("access", "can_read"), asyncHandler(userController.getRoleAccess));
router.post("/accesses", checkAccess("access", "can_update"), asyncHandler(userController.updateRoleAccess));

module.exports = router;
