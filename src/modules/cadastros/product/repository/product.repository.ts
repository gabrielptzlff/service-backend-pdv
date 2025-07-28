import { Pool } from 'pg';
import { injectable } from 'tsyringe';
import { ProductDto } from '../dto/product.dto';
import { Product } from '../entity/product.entity';
import { pool } from '../../../../infra/db/pg-connection';
import { IProductRepository } from './product.repository.interface';

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly db: Pool = pool) {}

  async findAll(): Promise<Product[]> {
    const query = 'SELECT * FROM products';
    const result = await this.db.query(query);

    return result.rows.map(
      (row) => new Product(row.id, row.name, row.price, row.quantity),
    );
  }

  async findById(id: number): Promise<Product | undefined> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return new Product(row.id, row.name, row.price, row.quantity);
  }

  async findInSalesById(productId: number): Promise<boolean> {
    const query = 'SELECT 1 FROM sales_products WHERE product_id = $1 LIMIT 1';
    const result = await this.db.query(query, [productId]);

    return (result.rowCount ?? 0) > 0;
  }

  async create(productDto: ProductDto): Promise<Product> {
    const query = `
      INSERT INTO products (name, price, quantity)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [productDto.name, productDto.price, productDto.quantity];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new Product(row.id, row.name, row.price, row.quantity);
  }

  async update(
    id: number,
    productDto: Partial<ProductDto>,
  ): Promise<Product | undefined> {
    const fields: string[] = [];
    const values = [];
    let paramCount = 1;
    Object.entries(productDto).forEach(([key, value]) => {
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
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await this.db.query(query, values);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return new Product(row.id, row.name, row.price, row.quantity);
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
