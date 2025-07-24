export class PaymentMethod {
  constructor(
    public readonly id: number,
    public name: string,
    public installments: number,
  ) {}
}
