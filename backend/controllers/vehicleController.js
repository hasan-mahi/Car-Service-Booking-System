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
      res.status(400).json({ error: "Invalid vehicle ID" });
      return;
    }

    const result = await db.query(
      "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    const vehicle = result.rows[0];
    if (!vehicle || !canAccessResource(req.user, vehicle.user_id)) {
      res.status(404).json({ error: "Vehicle not found or access denied" });
      return;
    }

    res.json(vehicle);
  },

  async create(req, res) {
    if (!req.user?.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let { make, model, year, license_plate } = req.body;
    const user_id = req.user.id;

    make = make?.trim();
    model = model?.trim();
    license_plate = license_plate?.trim();

    if (!make || !model || !license_plate || typeof year !== "number") {
      res.status(400).json({ error: "Invalid or missing fields" });
      return;
    }

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
        // Duplicate license plate error
        res.status(400).json({ error: "License plate already exists" });
        return;
      }
      throw error; // rethrow for centralized error handler
    }
  },

  async update(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid vehicle ID" });
      return;
    }

    let { make, model, year, license_plate } = req.body;

    make = make?.trim();
    model = model?.trim();
    license_plate = license_plate?.trim();

    if (!make || !model || !license_plate || typeof year !== "number") {
      res.status(400).json({ error: "Invalid or missing fields" });
      return;
    }

    const vehicleResult = await db.query(
      "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    const vehicle = vehicleResult.rows[0];

    if (!vehicle || !canAccessResource(req.user, vehicle.user_id)) {
      res.status(404).json({ error: "Vehicle not found or access denied" });
      return;
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
        res.status(400).json({ error: "License plate already exists" });
        return;
      }
      throw error; // centralized error handler will catch this
    }
  },

  async delete(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid vehicle ID" });
      return;
    }

    const vehicleResult = await db.query(
      "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    const vehicle = vehicleResult.rows[0];

    if (!vehicle || !canAccessResource(req.user, vehicle.user_id)) {
      res.status(404).json({ error: "Vehicle not found or access denied" });
      return;
    }

    const now = getCurrentTime();

    await db.query(
      "UPDATE vehicle SET deleted_at = $1 WHERE id = $2",
      [now, id]
    );

    res.status(204).send();
  },
};

module.exports = vehicleController;
