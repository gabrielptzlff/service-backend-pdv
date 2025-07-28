import { ISalesRepository } from './repository/sales.repository.interface';
import { IProductRepository } from '../cadastros/product/repository/product.repository.interface';
import { SalesDto } from './dto/sales.dto';
import { SalesWithProductsDto } from './dto/sales-with-products.dto';
import { Sales } from './entity/sales.entity';
import { injectable, inject } from 'tsyringe';
import { IPaymentMethodRepository } from '../cadastros/payment-method/repository/payment-method.repository.interface';
import { PaymentMethod } from '../cadastros/payment-method/entity/payment-method.entity';
import { ICustomerRepository } from '../cadastros/customer/repository/customer.repository.interface';
import { ISalesProductRepository } from './repository/sales-product.repository.interface';
import { UpdateSalesDto } from './dto/update-sales.dto';

@injectable()
export class SalesService {
  constructor(
    @inject('SalesRepository')
    private readonly salesRepository: ISalesRepository,
    @inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @inject('ProductRepository')
    private readonly salesProductRepository: ISalesProductRepository,
    @inject('ProductRepository')
    private readonly productRepository: IProductRepository,
    @inject('PaymentMethodRepository')
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async getAll(): Promise<SalesWithProductsDto[]> {
    const sales = await this.salesRepository.findAll();

    const result = await Promise.all(
      sales.map(async (sale) => {
        const customer = sale.customer
          ? await this.customerRepository.findById(sale.customer)
          : null;
        const paymentMethod = sale.paymentMethod
          ? await this.paymentMethodRepository.findById(sale['paymentMethod'])
          : null;
        const products = await this.salesProductRepository.findBySalesId(
          sale.id,
        );
        return {
          ...sale,
          customer: customer ? [customer] : [],
          paymentMethod: paymentMethod ? [paymentMethod] : [],
          products: products,
        };
      }),
    );

    return result;
  }

  async getById(id: number): Promise<SalesWithProductsDto | null> {
    const sale = await this.salesRepository.findById(id);
    if (!sale) return null;

    const customer = sale.customer
      ? await this.customerRepository.findById(sale.customer)
      : null;
    const paymentMethod = sale.paymentMethod
      ? await this.paymentMethodRepository.findById(sale.paymentMethod)
      : null;
    const products = await this.salesProductRepository.findBySalesId(sale.id);

    return {
      ...sale,
      customer: customer ? [customer] : [],
      paymentMethod: paymentMethod ? [paymentMethod] : [],
      products: products,
    };
  }

  async create(createSalesDto: SalesDto): Promise<any> {
    const customer = await this.customerRepository.findById(
      createSalesDto.customerId,
    );
    if (!customer) {
      throw new Error(
        `Customer with id ${createSalesDto.customerId} not found`,
      );
    }
    const products = await Promise.all(
      createSalesDto.products.map(async (product) => {
        const foundProduct = await this.productRepository.findById(product.id);
        if (!foundProduct) {
          throw new Error(`Product with id ${product.id} not found`);
        }
        return { ...foundProduct, quantity: product.quantity };
      }),
    );

    const totalPrice = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
    const paymentMethod: PaymentMethod | null =
      await this.paymentMethodRepository.findById(
        createSalesDto.paymentMethodId,
      );
    if (!paymentMethod) {
      throw new Error(
        `Payment method with id ${createSalesDto.paymentMethodId} not found`,
      );
    }
    const sales = new Sales(
      0,
      createSalesDto.customerId,
      createSalesDto.paymentMethodId,
      totalPrice,
    );

    const createdSales = await this.salesRepository.create(sales);
    if (!createdSales || !createdSales.id) {
      throw new Error('Failed to create sales');
    }

    await Promise.all(
      products.map(async (product) =>
        this.salesProductRepository.create({
          salesId: createdSales.id,
          product: product,
          quantity: product.quantity,
          unit_price: product.price,
        }),
      ),
    );
    // Atualiza a quantidade do produto no estoque
    await Promise.all(
      createSalesDto.products.map(async (product) => {
        const foundProduct = await this.productRepository.findById(product.id);
        await this.productRepository.update(product.id, {
          quantity:
            (foundProduct ? foundProduct.quantity : 0) - product.quantity,
        });
      }),
    );
    return this.getById(createdSales.id);
  }

  async update(id: number, updateSalesDto: UpdateSalesDto): Promise<any> {
    // Busca a venda existente
    const existingSale = await this.getById(id);
    if (!existingSale) {
      throw new Error(`Sale with id ${id} not found`);
    }

    // Atualiza os dados principais da venda
    const products = await Promise.all(
      updateSalesDto.products.map(async (product) => {
        const foundProduct = await this.productRepository.findById(product.id);
        if (!foundProduct) {
          throw new Error(`Product with id ${product.id} not found`);
        }
        return { ...foundProduct, quantity: product.quantity };
      }),
    );

    const totalPrice = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );

    const paymentMethod = await this.paymentMethodRepository.findById(
      updateSalesDto.paymentMethodId,
    );
    if (!paymentMethod) {
      throw new Error(
        `Payment method with id ${updateSalesDto.paymentMethodId} not found`,
      );
    }

    // Atualiza a venda principal
    await this.salesRepository.update(id, {
      customerId: updateSalesDto.customerId,
      paymentMethodId: updateSalesDto.paymentMethodId,
      totalPrice: totalPrice,
    });

    await this.salesProductRepository.deleteBySalesId(id);

    await Promise.all(
      products.map(async (product) => {
        await this.salesProductRepository.create({
          salesId: id,
          product: product,
          quantity: product.quantity,
          unit_price: product.price,
        });
      }),
    );

    return this.getById(id);
  }

  async delete(id: number): Promise<any> {
    const sales = await this.salesRepository.findById(id);

    if (!sales) {
      throw new Error('Sale not found');
    }

    return this.salesRepository.delete(id);
  }
}
