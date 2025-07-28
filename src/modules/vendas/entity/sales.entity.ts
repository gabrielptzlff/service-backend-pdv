import { Customer } from '../../cadastros/customer/entity/customer.entity';
import { PaymentMethod } from '../../cadastros/payment-method/entity/payment-method.entity';
import { SalesProduct } from './sales-product.entity';

export class Sales {
  constructor(
    public readonly id: number,
    public customer: number,
    public paymentMethod: number,
    public totalPrice: number,
    public products?: [],
  ) {}
}
