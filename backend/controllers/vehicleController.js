const db = require("../db/index");
const { isAdmin, canAccessResource } = require("../utils/grantAccess");

const getCurrentTime = () => new Date(); // Server time

const vehicleController = {
  async getAll(req, res) {
    let result;

    if (isAdmin(req.user)) {
      result = await db.query(
        "SELECT * FROM vehicle WHERE deleted_at IS NULL ORDER BY id DESC"
      );
    } else {
      result = await db.query(
        "SELECT * FROM vehicle WHERE user_id = $1 AND deleted_at IS NULL ORDER BY id DESC",
        [req.user.id]
      );
    }

    res.json(result.rows);
  },

  async getById(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const result = await db.query(
      "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    const vehicle = result.rows[0];
    if (!vehicle || !canAccessResource(req.user, vehicle.user_id)) {
      return res.status(404).json({ error: "Vehicle not found or access denied" });
    }

    res.json(vehicle);
  },

  async create(req, res) {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // We rely on validation middleware, so use sanitized req.validatedBody
    const { make, model, year, license_plate } = req.validatedBody;
    const user_id = req.user.id;
    const now = getCurrentTime();

    const insertQuery = `
      INSERT INTO vehicle (user_id, make, model, year, license_plate, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [user_id, make, model, year, license_plate, now, now];

    try {
      const result = await db.query(insertQuery, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "License plate already exists" });
      }
      throw error;
    }
  },

  async update(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    // We rely on validation middleware, so use sanitized req.validatedBody
    const { make, model, year, license_plate } = req.validatedBody;

    const vehicleResult = await db.query(
      "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    const vehicle = vehicleResult.rows[0];

    if (!vehicle || !canAccessResource(req.user, vehicle.user_id)) {
      return res.status(404).json({ error: "Vehicle not found or access denied" });
    }

    const now = getCurrentTime();
    const updateQuery = `
      UPDATE vehicle
      SET make = $1, model = $2, year = $3, license_plate = $4, updated_at = $5
      WHERE id = $6
      RETURNING *;
    `;

    try {
      const result = await db.query(updateQuery, [
        make,
        model,
        year,
        license_plate,
        now,
        id,
      ]);

      res.json(result.rows[0]);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "License plate already exists" });
      }
      throw error;
    }
  },

  async delete(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const vehicleResult = await db.query(
      "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    const vehicle = vehicleResult.rows[0];

    if (!vehicle || !canAccessResource(req.user, vehicle.user_id)) {
      return res.status(404).json({ error: "Vehicle not found or access denied" });
    }

    const now = getCurrentTime();

    await db.query("UPDATE vehicle SET deleted_at = $1 WHERE id = $2", [now, id]);

    res.status(204).send();
  },
};

module.exports = vehicleController;
