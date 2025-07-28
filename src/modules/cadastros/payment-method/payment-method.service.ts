import { IPaymentMethodRepository } from './repository/payment-method.repository.interface';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { PaymentMethod } from './entity/payment-method.entity';
import { injectable, inject } from 'tsyringe';

@injectable()
export class PaymentMethodService {
  constructor(
    @inject('PaymentMethodRepository')
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async getAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.findAll();
  }

  async getById(id: number): Promise<PaymentMethod | null> {
    return this.paymentMethodRepository.findById(id);
  }

  async create(
    createPaymentMethodDto: PaymentMethodDto,
  ): Promise<PaymentMethod> {
    return this.paymentMethodRepository.create(createPaymentMethodDto);
  }

  async update(
    id: number,
    createPaymentMethodDto: PaymentMethodDto,
  ): Promise<PaymentMethod | null> {
    const paymentMethod = await this.paymentMethodRepository.findById(id);
    if (!paymentMethod) {
      throw new Error(`PaymentMethod with id ${id} not found`);
    }

    Object.assign(paymentMethod, createPaymentMethodDto);
    return paymentMethod
      ? this.paymentMethodRepository.update(id, paymentMethod)
      : null;
  }

  async delete(id: number): Promise<any> {
    const paymentMethod = await this.paymentMethodRepository.findById(id);
    if (!paymentMethod) {
      throw new Error(`Payment method with id ${id} not found`);
    }

    // Verifica se o método de pagamento está associado a vendas
    const salesPaymentMethod =
      await this.paymentMethodRepository.findInSalesById(id);

    if (salesPaymentMethod) {
      throw new Error(
        `Payment method with id ${id} cannot be deleted because it is associated with sales`,
      );
    }

    return this.paymentMethodRepository.delete(id);
  }
}
