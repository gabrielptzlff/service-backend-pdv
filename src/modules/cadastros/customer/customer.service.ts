import { ICustomerRepository } from './repository/customer.repository.interface';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './entity/customer.entity';
import { injectable, inject } from 'tsyringe';

@injectable()
export class CustomerService {
  constructor(
    @inject('CustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async getAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async getById(id: number): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }

  async create(createCustomerDto: CustomerDto): Promise<Customer> {
    return this.customerRepository.create(createCustomerDto);
  }

  async update(
    id: number,
    createCustomerDto: CustomerDto,
  ): Promise<Customer | null> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    Object.assign(customer, createCustomerDto);
    return customer ? this.customerRepository.update(id, customer) : null;
  }

  async delete(id: number): Promise<any> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return this.customerRepository.delete(id);
  }
}
