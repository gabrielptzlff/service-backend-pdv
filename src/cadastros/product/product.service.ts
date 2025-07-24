import { IProductRepository } from './repository/product.repository.interface';
import { ProductDto } from './dto/product.dto';
import { Product } from './entity/product.entity';
import { injectable, inject } from 'tsyringe';

@injectable()
export class ProductService {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async create(createProductDto: ProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async update(
    id: number,
    createProductDto: ProductDto,
  ): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    Object.assign(product, createProductDto);
    console.log('Updating product:', product);
    return product ? this.productRepository.update(id, product) : null;
  }

  async delete(id: number): Promise<any> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return this.productRepository.delete(id);
  }
}
