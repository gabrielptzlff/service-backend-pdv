import { ProductDto } from '../dto/product.dto';
import { Product } from '../entity/product.entity';

export interface IProductRepository {
  create(productDto: ProductDto): Promise<Product>;
  findById(id: number): Promise<Product | undefined>;
  findAll(): Promise<Product[]>;
  findInSalesById(productId: number): Promise<boolean>;
  update(
    id: number,
    productDto: Partial<ProductDto>,
  ): Promise<Product | undefined>;
  delete(id: number): Promise<boolean>;
}
