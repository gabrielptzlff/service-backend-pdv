import { Pool } from 'pg';
import { injectable } from 'tsyringe';
import { SalesDto } from '../dto/sales.dto';
import { Sales } from '../entity/sales.entity';
import { pool } from '../../../infra/db/pg-connection';
import { ISalesRepository } from './sales.repository.interface';
import { UpdateSalesDto } from '../dto/update-sales.dto';

@injectable()
export class SalesRepository implements ISalesRepository {
  constructor(private readonly db: Pool = pool) {}

  async findAll(): Promise<Sales[]> {
    const query = `SELECT * FROM sales`;
    const result = await this.db.query(query);
    const rows = result.rows;

    return rows.map(
      (row) =>
        new Sales(
          row.id,
          row.customer_id,
          row.payment_method_id,
          row.total_price,
        ),
    );
  }

  async findById(id: number): Promise<Sales | null> {
    const query = `SELECT * FROM sales WHERE id = $1 `;
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Sales(
      row.id,
      row.customer_id,
      row.payment_method_id,
      row.total_price,
    );
  }

  async create(sales: Sales): Promise<Sales> {
    const query = `
      INSERT INTO sales (customer_id, payment_method_id, total_price)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [sales.customer, sales.paymentMethod, sales.totalPrice];
    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new Sales(
      row.id,
      row.customer_id,
      row.total_price,
      row.payment_method_id,
    );
  }

  async update(
    id: number,
    updateSalesDto: Partial<UpdateSalesDto>,
  ): Promise<Sales | null> {
    const fields: string[] = [];
    const values = [];
    let paramCount = 1;
    const fieldMap = {
      customerId: 'customer_id',
      paymentMethodId: 'payment_method_id',
      totalPrice: 'total_price',
    };

    Object.entries(updateSalesDto).forEach(([key, value]) => {
      if (key in fieldMap) {
        key = fieldMap[key as keyof typeof fieldMap];
      }
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
      UPDATE sales
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
    return new Sales(
      row.id,
      row.customer_id,
      row.payment_method_id,
      row.total_price,
    );
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM sales WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
