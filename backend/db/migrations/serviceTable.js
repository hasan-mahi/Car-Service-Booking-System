const db = require("../index");

async function serviceTable() {
    const tableName = 'service';

    // Check if table exists
    const checkTable = await db.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = '${tableName}'
    );
  `);

    if (!checkTable.rows[0].exists) {
        // Create table if not exists
        const createQuery = `
        CREATE TABLE ${tableName} (
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'active',
        category VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP NULL,
        FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE
        );
        `;
        await db.query(createQuery);
        console.log(`🎉 '${tableName}' table created.`);
        return;
    }

    // Desired schema
    const desiredColumns = [
        { name: "id", type: "integer", nullable: false },
        { name: "vehicle_id", type: "integer", nullable: false },
        { name: "description", type: "text", nullable: false },
        { name: "price", type: "numeric", nullable: false },
        { name: "duration_minutes", type: "integer", nullable: false },
        { name: "status", type: "character varying", nullable: false },
        { name: "category", type: "character varying", nullable: true },
        { name: "created_at", type: "timestamp without time zone", nullable: false },
        { name: "updated_at", type: "timestamp without time zone", nullable: false },
        { name: "deleted_at", type: "timestamp without time zone", nullable: true },
    ];

    // Fetch existing columns
    const existingColumnsRes = await db.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = '${tableName}' AND table_schema = 'public';
  `);

    const existingColumns = {};
    for (const row of existingColumnsRes.rows) {
        existingColumns[row.column_name] = row;
    }

    let modificationsMade = false;

    // Add missing columns
    for (const col of desiredColumns) {
        if (!existingColumns[col.name]) {
            const nullSQL = col.nullable ? "NULL" : "NOT NULL";
            const addColumnSQL = `ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type} ${nullSQL};`;

            try {
                await db.query(addColumnSQL);
                console.log(`➕ Added missing column '${col.name}'`);
                modificationsMade = true;
            } catch (err) {
                console.error(`⚠️ Failed to add column '${col.name}':`, err.message);
            }
        }
    }

    // Drop extra columns
    const desiredColumnNames = new Set(desiredColumns.map(c => c.name));
    const extraColumns = Object.keys(existingColumns).filter(colName => !desiredColumnNames.has(colName));

    for (const colName of extraColumns) {
        try {
            await db.query(`ALTER TABLE ${tableName} DROP COLUMN ${colName} CASCADE;`);
            console.log(`🗑️ Dropped extra column '${colName}'`);
            modificationsMade = true;
        } catch (err) {
            console.error(`⚠️ Failed to drop column '${colName}':`, err.message);
        }
    }

    if (!modificationsMade) {
        console.log(`✔️ Nothing to modify. '${tableName}' table is up-to-date.`);
    }
}

module.exports = serviceTable;
