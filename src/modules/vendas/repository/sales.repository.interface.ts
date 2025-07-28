import { SalesDto } from '../dto/sales.dto';
import { UpdateSalesDto } from '../dto/update-sales.dto';
import { Sales } from '../entity/sales.entity';

export interface ISalesRepository {
  create(salesDto: Sales): Promise<Sales>;
  findById(id: number): Promise<Sales | null>;
  findAll(): Promise<Sales[]>;
  update(id: number, salesDto: Partial<UpdateSalesDto>): Promise<Sales | null>;
  delete(id: number): Promise<boolean>;
}
