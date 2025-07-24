import {
  Get,
  Post,
  Patch,
  Delete,
  JsonController,
  Body,
  Param,
} from 'routing-controllers';
import { CustomerDto } from './dto/customer.dto';
import { CustomerService } from './customer.service';

@JsonController('/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAll() {
    return this.customerService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.customerService.getById(id);
  }

  @Post()
  async create(@Body() customerDto: CustomerDto) {
    return this.customerService.create(customerDto);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() customerDto: CustomerDto) {
    return this.customerService.update(id, customerDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.customerService.delete(id);
  }
}
