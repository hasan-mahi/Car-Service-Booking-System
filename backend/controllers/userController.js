const db = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "8h";

const userController = {
  async registerUser(req, res) {
    const { username, email, password } = req.validatedBody;

    const existing = await db.query(
      `SELECT 1 FROM users WHERE (username = $1 OR email = $2) AND deleted_at IS NULL LIMIT 1`,
      [username.trim(), email.trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const roleRes = await db.query(
      `SELECT id, name FROM roles WHERE name = 'customer' AND deleted_at IS NULL LIMIT 1`
    );
    if (roleRes.rows.length === 0) {
      return res.status(500).json({ error: "Customer role not found" });
    }

    const { id: role_id, name: role_name } = roleRes.rows[0];
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (username, email, password, role_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, username, email, role_id`,
      [username.trim(), email.trim(), hashedPassword, role_id]
    );
    const user = result.rows[0];

    await db.query(
      `INSERT INTO accesses (role_id, resource, can_create, can_read, can_update, can_delete)
       VALUES ($1, 'vehicle', true, true, true, true)
       ON CONFLICT (role_id, resource)
       DO UPDATE SET
         can_create = EXCLUDED.can_create,
         can_read = EXCLUDED.can_read,
         can_update = EXCLUDED.can_update,
         can_delete = EXCLUDED.can_delete;`,
      [role_id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role_id, role_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ user: { ...user, role_name }, token });
  },

  async loginUser(req, res) {
    const { username, password } = req.validatedBody;

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
    res.json({ message: "Login successful", token, user: payload });
  },

  async getAllUsers(req, res) {
    const result = await db.query(`
      SELECT u.id, u.username, u.email, u.role_id, r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.id DESC
    `);
    res.json(result.rows);
  },

  async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { username, email, role_id } = req.validatedBody;

    const result = await db.query(
      `UPDATE users
       SET username = $1, email = $2, role_id = $3, updated_at = NOW()
       WHERE id = $4 AND deleted_at IS NULL
       RETURNING id, username, email, role_id`,
      [username.trim(), email.trim(), role_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found or deleted" });
    }

    res.json(result.rows[0]);
  },

  async deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await db.query(
      `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }

    res.sendStatus(204);
  },

  async getRoles(req, res) {
    const result = await db.query(
      `SELECT id, name FROM roles WHERE deleted_at IS NULL ORDER BY id`
    );
    res.json(result.rows);
  },

  async getRoleAccess(req, res) {
    const role_id = parseInt(req.params.role_id, 10);
    if (isNaN(role_id)) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    const result = await db.query(`SELECT * FROM accesses WHERE role_id = $1`, [role_id]);
    res.json(result.rows);
  },

  async updateRoleAccess(req, res) {
    const { role_id, resource, can_create, can_read, can_update, can_delete } = req.validatedBody;

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
  },
};

module.exports = userController;
