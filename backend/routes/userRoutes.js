const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Public routes (no auth)
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protect routes below this middleware
router.use(userController.authenticateToken);

// Protected user management routes with access control
router.get(
  "/",
  userController.checkAccess("user", "can_read"),   // permission to read users
  userController.getAllUsers
);

// Uncomment and add createUser method in controller if needed:
// router.post(
//   "/",
//   userController.checkAccess("user", "can_create"), // permission to create user
//   userController.createUser
// );

router.put(
  "/:id",
  userController.checkAccess("user", "can_update"), // permission to update user
  userController.updateUser
);

router.delete(
  "/:id",
  userController.checkAccess("user", "can_delete"), // permission to delete user
  userController.deleteUser
);

// Role management (read roles)
router.get(
  "/roles",
  userController.checkAccess("role", "can_read"),
  userController.getRoles
);

// Access management for roles (read and update accesses)
router.get(
  "/accesses/:role_id",
  userController.checkAccess("access", "can_read"),
  userController.getRoleAccess
);

router.post(
  "/accesses",
  userController.checkAccess("access", "can_update"),
  userController.updateRoleAccess
);

module.exports = router;
