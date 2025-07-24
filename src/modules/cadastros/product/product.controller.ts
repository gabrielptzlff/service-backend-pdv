import {
  Get,
  Post,
  Patch,
  Delete,
  JsonController,
  Body,
  Param,
} from 'routing-controllers';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@JsonController('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.productService.getById(id);
  }

  @Post()
  async create(@Body() productDto: ProductDto) {
    return this.productService.create(productDto);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() productDto: ProductDto) {
    return this.productService.update(id, productDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
