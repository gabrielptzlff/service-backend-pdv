import { pool } from '../pg-connection';

export async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL,
      payment_method_id INT NOT NULL,
      total_price NUMERIC(10, 4) NOT NULL
    );
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_customer_id'
      ) THEN
        ALTER TABLE sales
        ADD CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id);
      END IF;
    END
    $$;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_payment_method_id'
      ) THEN
        ALTER TABLE sales
        ADD CONSTRAINT fk_payment_method_id FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id);
      END IF;
    END
    $$;
  `);

  console.log('Migration UP: sales table created');
}

export async function down() {
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_customer_id'
      ) THEN
        ALTER TABLE sales DROP CONSTRAINT fk_customer_id;
      END IF;
      IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_payment_method_id'
      ) THEN
        ALTER TABLE sales DROP CONSTRAINT fk_payment_method_id;
      END IF;
    END
    $$;
    DROP TABLE IF EXISTS sales;
  `);

  console.log('Migration DOWN: sales table dropped');
}
