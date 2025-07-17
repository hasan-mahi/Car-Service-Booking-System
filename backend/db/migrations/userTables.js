const db = require("../index");

async function migrateUserRelatedTables() {
  // Create roles table
  await createOrUpdateTable("roles", [
    { name: "id", type: "serial", nullable: false, primary: true },
    { name: "name", type: "varchar(50)", nullable: false, unique: true },
    { name: "created_at", type: "timestamp", nullable: false, default: "NOW()" },
    { name: "updated_at", type: "timestamp", nullable: false, default: "NOW()" },
    { name: "deleted_at", type: "timestamp", nullable: true }
  ]);

  // Seed initial roles
  const roles = ["admin", "staff", "customer"];
  for (const roleName of roles) {
    await db.query(
      `INSERT INTO roles (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       ON CONFLICT (name) DO NOTHING`,
      [roleName]
    );
  }

  // Create accesses table
  await createOrUpdateTable("accesses", [
    { name: "id", type: "serial", nullable: false, primary: true },
    { name: "role_id", type: "integer", nullable: false },
    { name: "resource", type: "varchar(100)", nullable: false },
    { name: "can_create", type: "boolean", nullable: false, default: false },
    { name: "can_read", type: "boolean", nullable: false, default: true },
    { name: "can_update", type: "boolean", nullable: false, default: false },
    { name: "can_delete", type: "boolean", nullable: false, default: false }
  ]);

  // Add unique constraint to accesses table if missing
  await db.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_access_per_role_resource'
      ) THEN
        ALTER TABLE accesses ADD CONSTRAINT unique_access_per_role_resource UNIQUE (role_id, resource);
      END IF;
    END
    $$;
  `);

  // Create users table
  await createOrUpdateTable("users", [
    { name: "id", type: "serial", nullable: false, primary: true },
    { name: "username", type: "varchar(100)", nullable: false, unique: true },
    { name: "email", type: "varchar(255)", nullable: false, unique: true },
    { name: "password", type: "varchar(255)", nullable: false },
    { name: "role_id", type: "integer", nullable: false },
    { name: "created_at", type: "timestamp", nullable: false, default: "NOW()" },
    { name: "updated_at", type: "timestamp", nullable: false, default: "NOW()" },
    { name: "deleted_at", type: "timestamp", nullable: true }
  ]);
}

async function createOrUpdateTable(tableName, desiredColumns) {
  // Check if table exists
  const exists = await db.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    )
  `, [tableName]);

  if (!exists.rows[0].exists) {
    // Create new table
    const cols = desiredColumns.map(col => {
      let colDef = `${col.name} ${col.type}`;
      if (col.primary) colDef += " PRIMARY KEY";
      else {
        colDef += col.nullable ? " NULL" : " NOT NULL";
        if (col.unique) colDef += " UNIQUE";
        if (col.default !== undefined) {
          if (typeof col.default === "boolean") {
            colDef += ` DEFAULT ${col.default}`;
          } else {
            colDef += ` DEFAULT ${col.default}`;
          }
        }
      }
      return colDef;
    }).join(",\n  ");

    await db.query(`CREATE TABLE ${tableName} (\n  ${cols}\n);`);
    console.log(`🎉 '${tableName}' table created.`);
    return;
  }

  // If exists, add missing columns only (skip drop for safety)
  const existingColumnsRes = await db.query(`
    SELECT column_name 
    FROM information_schema.columns
    WHERE table_name = $1 AND table_schema = 'public'
  `, [tableName]);

  const existingCols = new Set(existingColumnsRes.rows.map(r => r.column_name));

  for (const col of desiredColumns) {
    if (!existingCols.has(col.name)) {
      let def = `${col.name} ${col.type} ${col.nullable ? "NULL" : "NOT NULL"}`;
      if (col.default !== undefined) {
        if (typeof col.default === "boolean") {
          def += ` DEFAULT ${col.default}`;
        } else {
          def += ` DEFAULT ${col.default}`;
        }
      }
      try {
        await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${def};`);
        console.log(`➕ Added column '${col.name}' to '${tableName}'`);
      } catch (err) {
        console.error(`⚠️ Failed to add '${col.name}' to '${tableName}':`, err.message);
      }
    }
  }

  console.log(`✔️ '${tableName}' table is up-to-date.`);
}

module.exports = migrateUserRelatedTables;
