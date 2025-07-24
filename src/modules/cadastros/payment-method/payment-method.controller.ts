import {
  Get,
  Post,
  Patch,
  Delete,
  JsonController,
  Body,
  Param,
} from 'routing-controllers';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@JsonController('/payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  async getAll() {
    return this.paymentMethodService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.paymentMethodService.getById(id);
  }

  @Post()
  async create(@Body() paymentMethodDto: PaymentMethodDto) {
    return this.paymentMethodService.create(paymentMethodDto);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() paymentMethodDto: PaymentMethodDto,
  ) {
    return this.paymentMethodService.update(id, paymentMethodDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.paymentMethodService.delete(id);
  }
}
