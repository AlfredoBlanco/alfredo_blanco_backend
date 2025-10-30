import { Client } from 'pg';
import { DB_HOST, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USERNAME } from "./global-vars";

const client = new Client({
  user: POSTGRES_USERNAME,
  host: DB_HOST,
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT, 10),
  database: 'postgres'
});

const dbName = POSTGRES_DB;

(async () => {
  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" creada correctamente.`);
    } else {
      console.log(`ℹ️ Database "${dbName}" ya existe.`);
    }
  } catch (err) {
    console.error('❌ Error creando la base:', err);
  } finally {
    await client.end();
  }
})();