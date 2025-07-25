import 'reflect-metadata';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

describe('ProductService CRUD', () => {
  let service: ProductService;
  let mocks: any;

  beforeEach(() => {
    mocks = {
      productRepository: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new ProductService(mocks.productRepository as any);
  });

  it('getAll deve retornar todos os produtos', async () => {
    mocks.productRepository.findAll.mockResolvedValue([
      { id: 1, name: 'Produto 1', price: 10 },
      { id: 2, name: 'Produto 2', price: 20 },
    ]);
    const result = await service.getAll();
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Produto 1');
  });

  it('getById deve retornar um produto', async () => {
    mocks.productRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Produto 1',
      price: 10,
    });
    const result = await service.getById(1);
    expect(result?.id).toBe(1);
    expect(result?.name).toBe('Produto 1');
  });

  it('create deve criar um produto', async () => {
    const dto: ProductDto = { name: 'Novo Produto', price: 15 } as any;
    mocks.productRepository.create.mockResolvedValue({
      id: 1,
      name: 'Novo Produto',
      price: 15,
    });
    const result = await service.create(dto);
    expect(result?.id).toBe(1);
    expect(mocks.productRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update deve atualizar um produto', async () => {
    const dto: ProductDto = { name: 'Produto Atualizado', price: 30 } as any;
    mocks.productRepository.update.mockResolvedValue({
      id: 1,
      name: 'Produto Atualizado',
      price: 30,
    });
    const result = await service.update(1, dto);
    expect(result?.name).toBe('Produto Atualizado');
    expect(mocks.productRepository.update).toHaveBeenCalledWith(1, dto);
  });

  it('delete deve remover um produto', async () => {
    mocks.productRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.productRepository.delete).toHaveBeenCalledWith(1);
  });
});
