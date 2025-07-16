const db = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "8h";

const userController = {
  // Register new user - assigns customer role by default
async registerUser(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if username or email already exists
    const existing = await db.query(
      `SELECT 1 FROM users WHERE (username = $1 OR email = $2) AND deleted_at IS NULL LIMIT 1`,
      [username.trim(), email.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Get customer role id
    const roleRes = await db.query(
      `SELECT id FROM roles WHERE name = 'customer' AND deleted_at IS NULL LIMIT 1`
    );

    if (roleRes.rows.length === 0) {
      return res.status(500).json({ error: "Customer role not found" });
    }
    const role_id = roleRes.rows[0].id;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (username, email, password, role_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, username, email, role_id`,
      [username.trim(), email.trim(), hashedPassword, role_id]
    );

    const user = result.rows[0];

    // Generate JWT token for the new user
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("❌ Error registering user:", err.message, err.stack);
    res.status(500).json({ error: "Failed to register user" });
  }
},


  // Login user and return JWT token with role info
  async loginUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    try {
      const result = await db.query(
        `SELECT u.id, u.username, u.email, u.password, u.role_id, r.name as role_name
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.username = $1 AND u.deleted_at IS NULL`,
        [username.trim()]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
        },
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      res.status(500).json({ error: "Failed to login" });
    }
  },

  // Middleware: Authenticate JWT token
  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Access token missing" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid or expired token" });
      req.user = user;
      next();
    });
  },

  // Middleware: Check permission on resource and action, admin bypass
  checkAccess(resource, action) {
    return async (req, res, next) => {
      try {
        if (req.user.role_name === "admin") {
          return next();
        }

        const validActions = ["can_create", "can_read", "can_update", "can_delete"];
        if (!validActions.includes(action)) {
          return res.status(400).json({ error: "Invalid action for access control" });
        }

        const query = `
          SELECT ${validActions.join(", ")}
          FROM accesses
          WHERE role_id = $1 AND resource = $2
          LIMIT 1
        `;
        const result = await db.query(query, [req.user.role_id, resource]);

        if (result.rows.length === 0) {
          return res.status(403).json({ error: "Access denied: no permissions for this resource" });
        }

        if (result.rows[0][action]) {
          return next();
        }

        return res.status(403).json({ error: "Access denied: insufficient permissions" });
      } catch (err) {
        console.error("❌ Permission check error:", err);
        res.status(500).json({ error: "Internal Server Error during permission check" });
      }
    };
  },

  // Get all users excluding soft-deleted
  async getAllUsers(req, res) {
    try {
      const result = await db.query(`
        SELECT u.id, u.username, u.email, u.role_id, r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.deleted_at IS NULL
        ORDER BY u.id DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // Update user data (username, email, role)
  async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const { username, email, role_id } = req.body;

    if (!username || !email || !role_id || isNaN(id)) {
      return res.status(400).json({ error: "Missing or invalid input" });
    }

    try {
      const result = await db.query(
        `UPDATE users
         SET username = $1,
             email = $2,
             role_id = $3,
             updated_at = NOW()
         WHERE id = $4 AND deleted_at IS NULL
         RETURNING id, username, email, role_id`,
        [username.trim(), email.trim(), role_id, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found or deleted" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("❌ Error updating user:", err);
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  // Soft delete user
  async deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    try {
      const result = await db.query(
        `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found or already deleted" });
      }
      res.sendStatus(204);
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  },

  // Get all roles
  async getRoles(req, res) {
    try {
      const result = await db.query(
        `SELECT id, name FROM roles WHERE deleted_at IS NULL ORDER BY id`
      );
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Failed to get roles:", err);
      res.status(500).json({ error: "Failed to fetch roles" });
    }
  },

  // Get access list by role
  async getRoleAccess(req, res) {
    const role_id = parseInt(req.params.role_id, 10);
    if (isNaN(role_id)) return res.status(400).json({ error: "Invalid role ID" });

    try {
      const result = await db.query(
        `SELECT * FROM accesses WHERE role_id = $1`,
        [role_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Failed to fetch access:", err);
      res.status(500).json({ error: "Failed to fetch access" });
    }
  },

  // Insert or update access for a role
  async updateRoleAccess(req, res) {
    const { role_id, resource, can_create, can_read, can_update, can_delete } = req.body;

    if (!role_id || !resource) {
      return res.status(400).json({ error: "Missing role_id or resource" });
    }

    try {
      const upsert = `
        INSERT INTO accesses (role_id, resource, can_create, can_read, can_update, can_delete)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (role_id, resource)
        DO UPDATE SET
          can_create = EXCLUDED.can_create,
          can_read = EXCLUDED.can_read,
          can_update = EXCLUDED.can_update,
          can_delete = EXCLUDED.can_delete;
      `;
      await db.query(upsert, [role_id, resource, can_create, can_read, can_update, can_delete]);
      res.json({ message: "Access updated" });
    } catch (err) {
      console.error("❌ Failed to update access:", err);
      res.status(500).json({ error: "Failed to update access" });
    }
  },
};

module.exports = userController;
