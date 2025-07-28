import { SalesProductDto } from '../dto/sales-product.dto';
import { SalesProduct } from '../entity/sales-product.entity';

export interface ISalesProductRepository {
  create(salesProductDto: SalesProduct): Promise<SalesProduct>;
  findById(id: number): Promise<SalesProduct | null>;
  findBySalesId(salesId: number): Promise<any[]>;
  update(
    id: number,
    salesProductDto: Partial<SalesProductDto>,
  ): Promise<SalesProduct | null>;
  deleteBySalesId(salesId: number): Promise<void>;
}
