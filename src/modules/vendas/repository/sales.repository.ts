import { Pool } from 'pg';
import { injectable } from 'tsyringe';
import { SalesDto } from '../dto/sales.dto';
import { Sales } from '../entity/sales.entity';
import { pool } from '../../../infra/db/pg-connection';
import { ISalesRepository } from './sales.repository.interface';

@injectable()
export class SalesRepository implements ISalesRepository {
  constructor(private readonly db: Pool = pool) {}

  async findAll(): Promise<Sales[]> {
    const query = 'SELECT * FROM sales';
    const result = await this.db.query(query);

    return result.rows.map(
      (row) => new Sales(row.id, row.customerId, row.productId, row.paymentMethodId),
    );
  }

  async findById(id: number): Promise<Sales | null> {
    const query = 'SELECT * FROM sales WHERE id = $1';
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Sales(row.id, row.customerId, row.productId, row.paymentMethodId);
  }

  async create(salesDto: SalesDto): Promise<Sales> {
    const query = `
      INSERT INTO sales (customer_id, product_id, payment_method_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [salesDto.customerId, salesDto.productId, salesDto.paymentMethodId];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new Sales(row.id, row.customerId, row.productId, row.paymentMethodId);
  }

  async update(
    id: number,
    salesDto: Partial<SalesDto>,
  ): Promise<Sales | null> {
    const fields: string[] = [];
    const values = [];
    let paramCount = 1;
    Object.entries(salesDto).forEach(([key, value]) => {
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
    return new Sales(row.id, row.customerId, row.productId, row.paymentMethodId);
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM sales WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
