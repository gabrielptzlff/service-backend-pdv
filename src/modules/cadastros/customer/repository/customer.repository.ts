import { Pool } from 'pg';
import { injectable } from 'tsyringe';
import { CustomerDto } from '../dto/customer.dto';
import { Customer } from '../entity/customer.entity';
import { ICustomerRepository } from './customer.repository.interface';
import { pool } from '../../../../infra/db/pg-connection';

@injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly db: Pool = pool) {}

  async findAll(): Promise<Customer[]> {
    const query = 'SELECT * FROM customers';
    const result = await this.db.query(query);

    return result.rows.map(
      (row) =>
        new Customer(
          row.id,
          row.name,
          row.email,
          row.postal_code,
          row.street,
          row.number,
          row.complement,
          row.neighborhood,
          row.city,
          row.state,
        ),
    );
  }

  async findById(id: number): Promise<Customer | null> {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Customer(
      row.id,
      row.name,
      row.email,
      row.postal_code,
      row.street,
      row.number,
      row.complement,
      row.neighborhood,
      row.city,
      row.state,
    );
  }

  async create(customerDto: CustomerDto): Promise<Customer> {
    const query = `
      INSERT INTO customers (name, email, postal_code, street, number, complement, neighborhood, city, state)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      customerDto.name,
      customerDto.email,
      customerDto.postalCode,
      customerDto.street,
      customerDto.number,
      customerDto.complement,
      customerDto.neighborhood,
      customerDto.city,
      customerDto.state,
    ];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new Customer(
      row.id,
      row.name,
      row.email,
      row.postal_code,
      row.street,
      row.number,
      row.complement,
      row.neighborhood,
      row.city,
      row.state,
    );
  }

  async update(
    id: number,
    customerDto: Partial<CustomerDto>,
  ): Promise<Customer | null> {
    const fields: string[] = [];
    const values = [];
    let paramCount = 1;
    const fieldMap = {
      postalCode: 'postal_code',
    };

    Object.entries(customerDto).forEach(([key, value]) => {
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
      UPDATE customers 
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
    return new Customer(
      row.id,
      row.name,
      row.email,
      row.postal_code,
      row.street,
      row.number,
      row.complement,
      row.neighborhood,
      row.city,
      row.state,
    );
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM customers WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
