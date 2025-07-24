import { pool } from '../pg-connection';

export async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      installments INT NOT NULL
    );
  `);
  console.log('Migration UP: payment_methods table created');
}

export async function down() {
  await pool.query(`DROP TABLE IF EXISTS payment_methods;`);
  console.log('Migration DOWN: payment_methods table dropped');
}
