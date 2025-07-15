const fs = require("fs");
const path = require("path");

async function runMigrations() {
  try {
    const migrationsPath = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationsPath).filter(f => f.endsWith(".js"));

    for (const file of files) {
      const migration = require(path.join(migrationsPath, file));
      if (typeof migration === "function") {
        console.log(`Running migration: ${file}`);
        await migration();
      }
    }

    console.log("🎉 All migrations completed.");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    process.exit();
  }
}

runMigrations();
