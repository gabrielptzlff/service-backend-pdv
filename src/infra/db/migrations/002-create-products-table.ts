import { pool } from '../pg-connection';

export async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      quantity INT NOT NULL
    );
  `);
  console.log('Migration UP: products table created');
}

export async function down() {
  await pool.query(`DROP TABLE IF EXISTS products;`);
  console.log('Migration DOWN: products table dropped');
}
