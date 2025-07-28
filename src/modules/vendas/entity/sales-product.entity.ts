import { Product } from '../../cadastros/product/entity/product.entity';

export class SalesProduct {
  constructor(
    public salesId: number,
    public product: Product,
    public quantity: number,
    public unit_price: number,
  ) {}
}
