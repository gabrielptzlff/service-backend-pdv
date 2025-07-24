import { pool } from '../pg-connection';

export async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      postal_code VARCHAR(20),
      street VARCHAR(255),
      number VARCHAR(50),
      complement VARCHAR(255),
      neighborhood VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(100)
    );
  `);
  console.log('Migration UP: customers table created');
}

export async function down() {
  await pool.query(`DROP TABLE IF EXISTS customers;`);
  console.log('Migration DOWN: customers table dropped');
}
