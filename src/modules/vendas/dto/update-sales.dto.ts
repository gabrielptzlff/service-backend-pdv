import { SalesProductDto } from './sales-product.dto';

export interface UpdateSalesDto {
  id: number;
  customerId: number;
  paymentMethodId: number;
  totalPrice?: number;
  products: SalesProductDto[];
}
