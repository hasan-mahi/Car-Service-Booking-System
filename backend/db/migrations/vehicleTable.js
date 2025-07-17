const db = require("../index");

async function vehicleTable() {
  // Check if table exists
  const checkTable = await db.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'vehicle'
    );
  `);

  if (!checkTable.rows[0].exists) {
    // Table doesn't exist, create it fully
    const createQuery = `
      CREATE TABLE vehicle (
        id SERIAL PRIMARY KEY,
        make VARCHAR(255) NOT NULL,
        model VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        license_plate VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL
      );
    `;
    await db.query(createQuery);
    console.log("🎉 'vehicle' table created.");
    return;
  }

  // Desired columns (your model)
  const desiredColumns = [
    { name: "id", type: "integer", nullable: false },
     { name: "user_id", type: "integer", nullable: false },
    { name: "make", type: "character varying", nullable: false },
    { name: "model", type: "character varying", nullable: false },
    { name: "year", type: "integer", nullable: false },
    { name: "license_plate", type: "character varying", nullable: false },
    { name: "created_at", type: "timestamp without time zone", nullable: false },
    { name: "updated_at", type: "timestamp without time zone", nullable: false },
    { name: "deleted_at", type: "timestamp without time zone", nullable: true },
  ];

  // Fetch existing columns info from DB
  const existingColumnsRes = await db.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'vehicle' AND table_schema = 'public';
  `);

  const existingColumns = {};
  for (const row of existingColumnsRes.rows) {
    existingColumns[row.column_name] = row;
  }

  let modificationsMade = false;

  // Add missing columns
  for (const col of desiredColumns) {
    if (!existingColumns[col.name]) {
      let nullSQL = col.nullable ? "NULL" : "NOT NULL";
      let addColumnSQL = `ALTER TABLE vehicle ADD COLUMN ${col.name} ${col.type} ${nullSQL};`;

      try {
        await db.query(addColumnSQL);
        console.log(`➕ Added missing column '${col.name}'`);
        modificationsMade = true;
      } catch (err) {
        console.error(`⚠️ Failed to add column '${col.name}':`, err.message);
      }
    }
  }

  // Detect columns in DB but not in desired model (extra columns)
  const desiredColumnNames = new Set(desiredColumns.map(c => c.name));
  const extraColumns = Object.keys(existingColumns).filter(colName => !desiredColumnNames.has(colName));

  if (extraColumns.length > 0) {
    console.warn(`⚠️ Extra columns detected in 'vehicle' table not in model: ${extraColumns.join(", ")}`);

    // OPTIONAL: Drop these extra columns automatically (commented out by default)
    for (const colName of extraColumns) {
      try {
        await db.query(`ALTER TABLE vehicle DROP COLUMN ${colName} CASCADE;`);
        console.log(`🗑️ Dropped extra column '${colName}'`);
        modificationsMade = true;
      } catch (err) {
        console.error(`⚠️ Failed to drop column '${colName}':`, err.message);
      }
    }
    
  }

  // Check and add unique constraint on license_plate if missing
  const uniqueConstraintRes = await db.query(`
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'vehicle'::regclass 
      AND contype = 'u'
      AND conkey @> (
        SELECT array_agg(attnum)
        FROM pg_attribute
        WHERE attrelid = 'vehicle'::regclass AND attname = 'license_plate'
      );
  `);

  if (uniqueConstraintRes.rowCount === 0) {
    try {
      await db.query(`ALTER TABLE vehicle ADD CONSTRAINT unique_license_plate UNIQUE (license_plate);`);
      console.log("✅ Added unique constraint on license_plate");
      modificationsMade = true;
    } catch (err) {
      console.error("⚠️ Failed to add unique constraint on license_plate:", err.message);
    }
  }

  if (!modificationsMade) {
    console.log("✔️ Nothing to modify. Table is up-to-date.");
  }
}

module.exports = vehicleTable;
