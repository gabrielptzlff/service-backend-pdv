import { ISalesRepository } from './repository/sales.repository.interface';
import { IProductRepository } from '../cadastros/product/repository/product.repository.interface';
import { SalesDto } from './dto/sales.dto';
import { Sales } from './entity/sales.entity';
import { injectable, inject } from 'tsyringe';

@injectable()
export class SalesService {
  constructor(
    @inject('SalesRepository')
    private readonly salesRepository: ISalesRepository,
    @inject('ProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async getAll(): Promise<Sales[]> {
    return this.salesRepository.findAll();
  }

  async getById(id: number): Promise<Sales | null> {
    return this.salesRepository.findById(id);
  }

  async create(
    createSalesDto: SalesDto,
  ): Promise<Sales> {
    const product = await this.productRepository.findById(createSalesDto.productId);
    
    if (!product) {
      throw new Error(`Product with id ${createSalesDto.productId} not found`);
    }

    if (product.quantity < createSalesDto.quantity) {
      throw new Error(`Insufficient stock for product with id ${createSalesDto.productId}`);
    }

    product.quantity -= createSalesDto.quantity;

    await this.productRepository.update(product.id, product)

    return this.salesRepository.create(createSalesDto);
  }

  async update(
    id: number,
    createSalesDto: SalesDto,
  ): Promise<Sales | null> {
    const sales = await this.salesRepository.findById(id);
    if (!sales) {
      throw new Error(`Sales with id ${id} not found`);
    }

    Object.assign(sales, createSalesDto);
    return sales
      ? this.salesRepository.update(id, sales)
      : null;
  }

  async delete(id: number): Promise<any> {
    const sales = await this.salesRepository.findById(id);
    if (!sales) {
      throw new Error(`Sales with id ${id} not found`);
    }

    return this.salesRepository.delete(id);
  }
}
