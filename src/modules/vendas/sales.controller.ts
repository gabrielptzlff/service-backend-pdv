import {
  Get,
  Post,
  Patch,
  Delete,
  JsonController,
  Body,
  Param,
} from 'routing-controllers';
import { SalesDto } from './dto/sales.dto';
import { SalesService } from './sales.service';

@JsonController('/payment-methods')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async getAll() {
    return this.salesService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.salesService.getById(id);
  }

  @Post()
  async create(@Body() salesDto: SalesDto) {
    return this.salesService.create(salesDto);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() salesDto: SalesDto) {
    return this.salesService.update(id, salesDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.salesService.delete(id);
  }
}
