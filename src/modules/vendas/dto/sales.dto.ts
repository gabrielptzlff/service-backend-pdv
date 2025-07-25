import { SalesProductDto } from './sales-product.dto';

export interface SalesDto {
  customerId: number;
  paymentMethodId: number;
  products: SalesProductDto[];
}
