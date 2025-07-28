import { pool } from '../pg-connection';

export async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL,
      payment_method_id INT NOT NULL,
      total_price NUMERIC(10, 4) NOT NULL
    );

    ALTER TABLE sales
    ADD CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id),
    ADD CONSTRAINT fk_payment_method_id FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
  `);

  console.log('Migration UP: sales table created');
}

export async function down() {
  await pool.query(`
    ALTER TABLE sales
    DROP CONSTRAINT fk_customer_id,
    DROP CONSTRAINT fk_payment_method_id;

    DROP TABLE IF EXISTS sales;`);

  console.log('Migration DOWN: sales table dropped');
}
