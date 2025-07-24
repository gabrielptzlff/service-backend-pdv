import { SalesDto } from '../dto/sales.dto';
import { Sales } from '../entity/sales.entity';

export interface ISalesRepository {
  create(salesDto: SalesDto): Promise<Sales>;
  findById(id: number): Promise<Sales | null>;
  findAll(): Promise<Sales[]>;
  update(
    id: number,
    salesDto: Partial<SalesDto>,
  ): Promise<Sales | null>;
  delete(id: number): Promise<boolean>;
}
