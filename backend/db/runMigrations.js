const vehicleTable = require("./migrations/vehicleTable");
const migrateUserRelatedTables = require("./migrations/userTables");
const serviceTable = require("./migrations/serviceTable");

async function runMigrations() {
  try {
    await vehicleTable();
    await migrateUserRelatedTables();
    await serviceTable();
    console.log("✅ All migrations completed.");
  } catch (err) {
    console.error("❌ Migration error:", err.message);
  } finally {
    process.exit();
  }
}

runMigrations();
