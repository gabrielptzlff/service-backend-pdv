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

  // Possível melhoria: validar a quantidade e preço antes de disponibilizar o produto para venda
  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getById(id: number): Promise<Product | undefined> {
    return this.productRepository.findById(id);
  }

  async create(createProductDto: ProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  /* Possíveis melhorias: 
  1. Bloquear a redução de quantidade abaixo de zero
  2. Bloquear a redução manual de quantidade caso o produto esteja associado a vendas
  */
  async update(
    id: number,
    createProductDto: ProductDto,
  ): Promise<Product | undefined> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    Object.assign(product, createProductDto);
    return product ? this.productRepository.update(id, product) : undefined;
  }

  async delete(id: number): Promise<any> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    // Verifica se o produto está associado a vendas
    const salesProduct = await this.productRepository.findInSalesById(id);

    if (salesProduct) {
      throw new Error(
        `Product with id ${id} cannot be deleted because it is associated with sales`,
      );
    }

    return this.productRepository.delete(id);
  }
}
