import { ProductDto } from '../dto/product.dto';
import { Product } from '../entity/product.entity';

export interface IProductRepository {
  create(productDto: ProductDto): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: number, productDto: Partial<ProductDto>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}
