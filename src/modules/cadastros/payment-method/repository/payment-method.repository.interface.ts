import { PaymentMethodDto } from '../dto/payment-method.dto';
import { PaymentMethod } from '../entity/payment-method.entity';

export interface IPaymentMethodRepository {
  create(paymentMethodDto: PaymentMethodDto): Promise<PaymentMethod>;
  findById(id: number): Promise<PaymentMethod | null>;
  findAll(): Promise<PaymentMethod[]>;
  update(
    id: number,
    paymentMethodDto: Partial<PaymentMethodDto>,
  ): Promise<PaymentMethod | null>;
  delete(id: number): Promise<boolean>;
}
