import 'reflect-metadata';
import { ProductService } from './product.service';

const makeMocks = () => ({
  productRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findInSalesById: jest.fn(),
  },
});

describe('ProductService', () => {
  let service: ProductService;
  let mocks: ReturnType<typeof makeMocks>;

  beforeEach(() => {
    mocks = makeMocks();
    service = new ProductService(mocks.productRepository as any);
  });

  it('getAll deve retornar todos os produtos', async () => {
    mocks.productRepository.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await service.getAll();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('getById deve retornar o produto', async () => {
    mocks.productRepository.findById.mockResolvedValue({ id: 1 });
    const result = await service.getById(1);
    expect(result).toEqual({ id: 1 });
  });

  it('getById deve retornar undefined se não existir', async () => {
    mocks.productRepository.findById.mockResolvedValue(undefined);
    const result = await service.getById(1);
    expect(result).toBeUndefined();
  });

  it('create deve criar um produto', async () => {
    const dto = { name: 'Produto' };
    mocks.productRepository.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mocks.productRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update deve atualizar um produto', async () => {
    const dto = { name: 'Atualizado' };
    mocks.productRepository.findById.mockResolvedValue({ id: 1 });
    mocks.productRepository.update.mockResolvedValue({ id: 1, ...dto });
    const result = await service.update(1, dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mocks.productRepository.update).toHaveBeenCalledWith(1, {
      id: 1,
      ...dto,
    });
  });

  it('update deve lançar erro se produto não existir', async () => {
    mocks.productRepository.findById.mockResolvedValue(undefined);
    await expect(service.update(1, { name: 'X' } as any)).rejects.toThrow(
      'Product with id 1 not found',
    );
  });

  it('delete deve remover um produto se não estiver associado a vendas', async () => {
    mocks.productRepository.findById.mockResolvedValue({ id: 1 });
    mocks.productRepository.findInSalesById.mockResolvedValue(false);
    mocks.productRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.productRepository.delete).toHaveBeenCalledWith(1);
  });

  it('delete deve lançar erro se produto não existir', async () => {
    mocks.productRepository.findById.mockResolvedValue(undefined);
    await expect(service.delete(1)).rejects.toThrow(
      'Product with id 1 not found',
    );
    expect(mocks.productRepository.delete).not.toHaveBeenCalled();
  });

  it('delete deve lançar erro se produto estiver associado a vendas', async () => {
    mocks.productRepository.findById.mockResolvedValue({ id: 1 });
    mocks.productRepository.findInSalesById.mockResolvedValue(true);
    await expect(service.delete(1)).rejects.toThrow(
      'Product with id 1 cannot be deleted because it is associated with sales',
    );
    expect(mocks.productRepository.delete).not.toHaveBeenCalled();
  });
});
