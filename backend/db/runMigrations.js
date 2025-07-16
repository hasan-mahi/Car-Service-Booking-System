const vehicleTable = require("./migrations/vehicleTable");
const migrateUserRelatedTables = require("./migrations/userTables");

async function runMigrations() {
  try {
    await vehicleTable();
    await migrateUserRelatedTables();
    console.log("✅ All migrations completed.");
  } catch (err) {
    console.error("❌ Migration error:", err.message);
  } finally {
    process.exit();
  }
}

runMigrations();
