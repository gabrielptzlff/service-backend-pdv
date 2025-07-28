import { Pool } from 'pg';
import { injectable } from 'tsyringe';
import { PaymentMethodDto } from '../dto/payment-method.dto';
import { PaymentMethod } from '../entity/payment-method.entity';
import { pool } from '../../../../infra/db/pg-connection';
import { IPaymentMethodRepository } from './payment-method.repository.interface';

@injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
  constructor(private readonly db: Pool = pool) {}

  async findAll(): Promise<PaymentMethod[]> {
    const query = 'SELECT * FROM payment_methods';
    const result = await this.db.query(query);

    return result.rows.map(
      (row) => new PaymentMethod(row.id, row.name, row.installments),
    );
  }

  async findById(id: number): Promise<PaymentMethod | null> {
    const query = 'SELECT * FROM payment_methods WHERE id = $1';
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new PaymentMethod(row.id, row.name, row.installments);
  }

  async create(paymentMethodDto: PaymentMethodDto): Promise<PaymentMethod> {
    const query = `
      INSERT INTO payment_methods (name, installments)
      VALUES ($1, $2)
      RETURNING *
    `;

    const values = [paymentMethodDto.name, paymentMethodDto.installments];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new PaymentMethod(row.id, row.name, row.installments);
  }

  async update(
    id: number,
    paymentMethodDto: Partial<PaymentMethodDto>,
  ): Promise<PaymentMethod | null> {
    const fields: string[] = [];
    const values = [];
    let paramCount = 1;
    Object.entries(paymentMethodDto).forEach(([key, value]) => {
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
      UPDATE payment_methods
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
    return new PaymentMethod(row.id, row.name, row.installments);
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM payment_methods WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findInSalesById(paymentMethodId: number): Promise<boolean> {
    const query = 'SELECT 1 FROM sales WHERE payment_method_id = $1 LIMIT 1';
    const result = await this.db.query(query, [paymentMethodId]);

    return (result.rowCount ?? 0) > 0;
  }
}
