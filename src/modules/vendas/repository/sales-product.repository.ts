import { Pool } from 'pg';
import { injectable } from 'tsyringe';
import { pool } from '../../../infra/db/pg-connection';
import { SalesProduct } from '../entity/sales-product.entity';
import { ISalesProductRepository } from './sales-product.repository.interface';
import { SalesProductDto } from '../dto/sales-product.dto';

@injectable()
export class SalesProductRepository implements ISalesProductRepository {
  constructor(private readonly db: Pool = pool) {}

  async findAll(): Promise<SalesProduct[]> {
    const query = 'SELECT * FROM sales_products';
    const result = await this.db.query(query);

    return result.rows.map(
      (row) =>
        new SalesProduct(
          row.sales_id,
          {
            id: row.product_id,
            name: row.product_name,
            price: row.product_price,
            quantity: row.product_quantity,
          },
          row.quantity,
          row.unit_price,
        ),
    );
  }

  async findById(id: number): Promise<SalesProduct | null> {
    const query = 'SELECT * FROM sales_products WHERE id = $1';
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new SalesProduct(
      row.sales_id,
      {
        id: row.product_id,
        name: row.product_name,
        price: row.product_price,
        quantity: row.product_quantity,
      },
      row.quantity,
      row.unit_price,
    );
  }

  async findBySalesId(salesId: number): Promise<any[]> {
    const query = 'SELECT * FROM sales_products WHERE sales_id = $1';
    const result = await this.db.query(query, [salesId]);
    return result.rows;
  }

  async create(salesProduct: SalesProduct): Promise<SalesProduct> {
    const query = `
      INSERT INTO sales_products (product_id, sales_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      salesProduct.product.id,
      salesProduct.salesId,
      salesProduct.quantity,
      salesProduct.product.price,
    ];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new SalesProduct(
      row.sales_id,
      salesProduct.product,
      row.quantity,
      row.unit_price,
    );
  }

  async update(
    id: number,
    salesProductsDto: Partial<SalesProductDto>,
  ): Promise<SalesProduct | null> {
    const fields: string[] = [];
    const values = [];
    let paramCount = 1;
    Object.entries(salesProductsDto).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });
    if (fields.length === 0) {
      return this.findById(id);
    }

    const query = `
      UPDATE sales_products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await this.db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new SalesProduct(
      row.sales_id,
      {
        id: row.product_id,
        name: row.product_name,
        price: row.product_price,
        quantity: row.product_quantity,
      },
      row.quantity,
      row.unit_price,
    );
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM sales_products WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
