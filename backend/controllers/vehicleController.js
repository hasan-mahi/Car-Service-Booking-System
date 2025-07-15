const db = require("../db/index");

const getCurrentTime = () => new Date(); // Uses server's local time or UTC depending on Node config

const vehicleController = {
  async getAll(req, res) {
    try {
      const result = await db.query(
        "SELECT * FROM vehicle WHERE deleted_at IS NULL ORDER BY id DESC"
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  },

  async getById(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid vehicle ID" });

    try {
      const result = await db.query(
        "SELECT * FROM vehicle WHERE id = $1 AND deleted_at IS NULL",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  async create(req, res) {
    const { make, model, year, license_plate } = req.body;

    if (
      !make || !model || ! license_plate || !year ||
      typeof make !== "string" ||
      typeof model !== "string" ||
      typeof  license_plate !== "string" ||
      typeof year !== "number"
    ) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    try {
      const now = getCurrentTime();

      const insertQuery = `
        INSERT INTO vehicle (make, model, year, license_plate, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const values = [make.trim(), model.trim(), year,  license_plate.trim(), now, now];

      const result = await db.query(insertQuery, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating vehicle:", error);

      if (error.code === "23505") {
        return res.status(400).json({ error: "Duplicate license plate" });
      }

      res.status(500).json({ error: "Failed to save vehicle" });
    }
  },

  async update(req, res) {
    const id = parseInt(req.params.id, 10);
    const { make, model, year,  license_plate } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid vehicle ID" });

    if (
      !make || !model || ! license_plate || !year ||
      typeof make !== "string" ||
      typeof model !== "string" ||
      typeof  license_plate !== "string" ||
      typeof year !== "number"
    ) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    try {
      const now = getCurrentTime();

      const updateQuery = `
        UPDATE vehicle
        SET make = $1,
            model = $2,
            year = $3,
            license_plate = $4,
            updated_at = $5
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING *
      `;

      const values = [make.trim(), model.trim(), year, license_plate.trim(), now, id];

      const result = await db.query(updateQuery, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Vehicle not found or deleted" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating vehicle:", error);

      if (error.code === "23505") {
        return res.status(400).json({ error: "Duplicate license plate" });
      }

      res.status(500).json({ error: "Failed to update vehicle" });
    }
  },

  async delete(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid vehicle ID" });

    try {
      const now = getCurrentTime();

      const deleteQuery = `
        UPDATE vehicle
        SET deleted_at = $1
        WHERE id = $2 AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await db.query(deleteQuery, [now, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Vehicle not found or already deleted" });
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  },
};

module.exports = vehicleController;
