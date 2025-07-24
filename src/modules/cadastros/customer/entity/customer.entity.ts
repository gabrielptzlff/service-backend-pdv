export class Customer {
  constructor(
    public readonly id: number,
    public name: string,
    public email?: string,
    public postalCode?: string,
    public street?: string,
    public number?: string,
    public complement?: string,
    public neighborhood?: string,
    public city?: string,
    public state?: string,
  ) {}
}
