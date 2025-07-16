const db = require("./index");
const bcrypt = require("bcrypt");

const ADMIN_ROLE_NAME = "admin";
const ADMIN_USER = {
  username: "admin",
  email: "admin@example.com",
  password: "admin1234", // Change in production!
};

const SALT_ROUNDS = 10;

// Known resources (keep this list synced with your app)
const RESOURCES = ["user", "role", "access", "vehicle", "booking"];

async function createAdmin() {
  try {
    // 1. Create 'admin' role if not exists
    const roleInsert = await db.query(
      `INSERT INTO roles (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       ON CONFLICT (name) DO NOTHING
       RETURNING id`,
      [ADMIN_ROLE_NAME]
    );

    let roleId;
    if (roleInsert.rows.length > 0) {
      roleId = roleInsert.rows[0].id;
      console.log(`✅ Created 'admin' role with id = ${roleId}`);
    } else {
      const existingRole = await db.query(
        `SELECT id FROM roles WHERE name = $1`,
        [ADMIN_ROLE_NAME]
      );
      roleId = existingRole.rows[0].id;
      console.log(`ℹ️ 'admin' role already exists (id = ${roleId})`);
    }

    // 2. Ensure unique constraint on accesses(role_id, resource) exists
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'unique_access_per_role_resource'
        ) THEN
          ALTER TABLE accesses ADD CONSTRAINT unique_access_per_role_resource UNIQUE (role_id, resource);
        END IF;
      END;
      $$;
    `);

    // 3. Grant full access for admin role to all resources
    for (const resource of RESOURCES) {
      await db.query(
        `INSERT INTO accesses (role_id, resource, can_create, can_read, can_update, can_delete)
         VALUES ($1, $2, true, true, true, true)
         ON CONFLICT (role_id, resource) DO UPDATE SET
           can_create = true,
           can_read = true,
           can_update = true,
           can_delete = true`,
        [roleId, resource]
      );
      console.log(`🔐 Granted full access to resource '${resource}'`);
    }

    // 4. Hash admin password
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, SALT_ROUNDS);

    // 5. Create admin user if not exists
    await db.query(
      `INSERT INTO users (username, email, password, role_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (username) DO NOTHING`,
      [ADMIN_USER.username, ADMIN_USER.email, hashedPassword, roleId]
    );

    console.log(`🎉 Admin user '${ADMIN_USER.username}' created or already exists`);
    console.log(`🔑 Login with username: ${ADMIN_USER.username} and password: ${ADMIN_USER.password}`);

  } catch (err) {
    console.error("❌ Failed to create admin:", err);
  } finally {
    await db.end();
  }
}

createAdmin();
