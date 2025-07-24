import { PaymentMethod } from "../../cadastros/payment-method/entity/payment-method.entity";
import { Product } from "../../cadastros/product/entity/product.entity";


export class Sales {
  constructor(
    public readonly id: number,
    public customerId: number,
    public product: Product,
    public quantity: number,
    public paymentMethod: PaymentMethod,
    public totalPrice: number,
  ) {}

  calculateTotalPrice(quantity: number, pricePerUnit: number): void {
    if (quantity < 0 || pricePerUnit < 0) {
      throw new Error("Quantity and price per unit must be non-negative.");
    }
    this.totalPrice = quantity * pricePerUnit;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }
}
