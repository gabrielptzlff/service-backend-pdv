import { CustomerDto } from '../dto/customer.dto';
import { Customer } from '../entity/customer.entity';

export interface ICustomerRepository {
  create(customerDto: CustomerDto): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  update(
    id: number,
    customerDto: Partial<CustomerDto>,
  ): Promise<Customer | null>;
  delete(id: number): Promise<boolean>;
}
