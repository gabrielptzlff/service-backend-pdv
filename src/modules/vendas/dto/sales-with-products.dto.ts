import { Customer } from '../../cadastros/customer/entity/customer.entity';
import { PaymentMethod } from '../../cadastros/payment-method/entity/payment-method.entity';
import { Product } from '../../cadastros/product/entity/product.entity';

export interface SalesWithProductsDto {
  id: number;
  customer: Customer[];
  paymentMethod: PaymentMethod[];
  totalPrice: number;
  items: Product[];
}
