import { SalesProductDto } from '../dto/sales-product.dto';
import { SalesProduct } from '../entity/sales-product.entity';

export interface ISalesProductRepository {
  create(salesProductDto: SalesProduct): Promise<SalesProduct>;
  findById(id: number): Promise<SalesProduct | null>;
  findBySalesId(salesId: number): Promise<any[]>;
  findAll(): Promise<SalesProduct[]>;
  update(
    id: number,
    salesProductDto: Partial<SalesProductDto>,
  ): Promise<SalesProduct | null>;
  delete(id: number): Promise<boolean>;
}
