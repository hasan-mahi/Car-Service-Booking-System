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
    { name: "can_create", type: "boolean", nullable: false, default: "false" },
    { name: "can_read", type: "boolean", nullable: false, default: "true" },
    { name: "can_update", type: "boolean", nullable: false, default: "false" },
    { name: "can_delete", type: "boolean", nullable: false, default: "false" }
  ]);

  // Add unique constraint to accesses table manually (if not exists)
  await db.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'unique_access_per_role_resource'
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

  // Create user_accesses table for per-user resource access overrides
  await createOrUpdateTable("user_accesses", [
    { name: "id", type: "serial", nullable: false, primary: true },
    { name: "user_id", type: "integer", nullable: false },
    { name: "resource", type: "varchar(100)", nullable: false },
    { name: "can_create", type: "boolean", nullable: false, default: "false" },
    { name: "can_read", type: "boolean", nullable: false, default: "true" },
    { name: "can_update", type: "boolean", nullable: false, default: "false" },
    { name: "can_delete", type: "boolean", nullable: false, default: "false" }
  ]);

  // Add unique constraint to user_accesses (if not exists)
  await db.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'unique_user_access_per_user_resource'
      ) THEN
        ALTER TABLE user_accesses ADD CONSTRAINT unique_user_access_per_user_resource UNIQUE (user_id, resource);
      END IF;
    END
    $$;
  `);
}

async function createOrUpdateTable(tableName, desiredColumns) {
  const exists = await db.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    )
  `, [tableName]);

  if (!exists.rows[0].exists) {
    const cols = desiredColumns.map(col => {
      let colDef = `${col.name} ${col.type}`;
      if (col.primary) colDef += " PRIMARY KEY";
      else {
        colDef += col.nullable ? " NULL" : " NOT NULL";
        if (col.unique) colDef += " UNIQUE";
        if (col.default) colDef += ` DEFAULT ${col.default}`;
      }
      return colDef;
    }).join(",\n  ");

    await db.query(`CREATE TABLE ${tableName} (\n  ${cols}\n);`);
    console.log(`🎉 '${tableName}' table created.`);
    return;
  }

  const existingColumnsRes = await db.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = $1 AND table_schema = 'public'
  `, [tableName]);

  const existingCols = {};
  for (const row of existingColumnsRes.rows) {
    existingCols[row.column_name] = row;
  }

  let modified = false;

  for (const col of desiredColumns) {
    if (!existingCols[col.name]) {
      let def = `${col.name} ${col.type} ${col.nullable ? "NULL" : "NOT NULL"}`;
      if (col.default) def += ` DEFAULT ${col.default}`;
      try {
        await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${def};`);
        console.log(`➕ Added column '${col.name}' to '${tableName}'`);
        modified = true;
      } catch (err) {
        console.error(`⚠️ Failed to add '${col.name}' to '${tableName}':`, err.message);
      }
    }
  }

  const modelColNames = new Set(desiredColumns.map(c => c.name));
  const extraCols = Object.keys(existingCols).filter(name => !modelColNames.has(name));

  for (const col of extraCols) {
    try {
      await db.query(`ALTER TABLE ${tableName} DROP COLUMN ${col} CASCADE;`);
      console.log(`🗑️ Dropped extra column '${col}' from '${tableName}'`);
      modified = true;
    } catch (err) {
      console.error(`⚠️ Could not drop '${col}' from '${tableName}':`, err.message);
    }
  }

  if (!modified) {
    console.log(`✔️ '${tableName}' table is up-to-date.`);
  }
}

module.exports = migrateUserRelatedTables;
