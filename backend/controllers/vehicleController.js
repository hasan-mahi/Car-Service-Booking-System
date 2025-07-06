const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const vehicleController = {
  async getAll(req, res) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: { id: "desc" },
      });
      res.json(vehicles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  },

  async getById(req, res) {
    const id = parseInt(req.params.id);
    try {
      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
      res.json(vehicle);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Invalid vehicle ID" });
    }
  },

async create(req, res) {
  const { make, model, year, licensePlate } = req.body;

  if (
    !make || !model || !year || !licensePlate ||
    typeof make !== "string" ||
    typeof model !== "string" ||
    typeof licensePlate !== "string" ||
    typeof year !== "number"
  ) {
    return res.status(400).json({ error: "Invalid or missing fields" });
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: { make, model, year, licensePlate },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Duplicate license plate or other DB error" });
  }
},

  async update(req, res) {
    const id = parseInt(req.params.id);
    try {
      const { make, model, year, licensePlate } = req.body;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { make, model, year, licensePlate },
      });
      res.json(vehicle);
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        // Prisma not found error code
        res.status(404).json({ error: "Vehicle not found" });
      } else {
        res.status(400).json({ error: "Invalid update request" });
      }
    }
  },

  async delete(req, res) {
    const id = parseInt(req.params.id);
    try {
      await prisma.vehicle.delete({ where: { id } });
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        res.status(404).json({ error: "Vehicle not found" });
      } else {
        res.status(400).json({ error: "Failed to delete vehicle" });
      }
    }
  },
};

module.exports = vehicleController;
