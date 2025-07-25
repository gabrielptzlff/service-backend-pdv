import { pool } from '../pg-connection';

export async function up() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales_products (
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL,
      sales_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price NUMERIC(10, 4) NOT NULL
    );

    ALTER TABLE sales_products
    ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id),
    ADD CONSTRAINT fk_sales_id FOREIGN KEY (sales_id) REFERENCES sales(id)
  `);

  console.log('Migration UP: sales_products table created');
}

export async function down() {
  await pool.query(`
    ALTER TABLE sales_products
    DROP CONSTRAINT fk_product_id,
    DROP CONSTRAINT fk_sales_id;

    DROP TABLE IF EXISTS sales_products;`);

  console.log('Migration DOWN: sales_products table dropped');
}
