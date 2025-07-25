import 'reflect-metadata';
import { SalesService } from './sales.service';
import { SalesDto } from './dto/sales.dto';

const makeMocks = () => ({
  salesRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customerRepository: { findById: jest.fn() },
  salesProductRepository: { findBySalesId: jest.fn(), create: jest.fn() },
  productRepository: { findById: jest.fn(), update: jest.fn() },
  paymentMethodRepository: { findById: jest.fn() },
});

describe('SalesService CRUD', () => {
  let service: SalesService;
  let mocks: ReturnType<typeof makeMocks>;

  beforeEach(() => {
    mocks = makeMocks();
    service = new SalesService(
      mocks.salesRepository as any,
      mocks.customerRepository as any,
      mocks.salesProductRepository as any,
      mocks.productRepository as any,
      mocks.paymentMethodRepository as any,
    );
  });

  it('getAll deve retornar vendas com customer, paymentMethod e items', async () => {
    mocks.salesRepository.findAll.mockResolvedValue([
      { id: 1, customer: 1, paymentMethod: 2 },
    ]);
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente',
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 2,
      name: 'Crédito',
    });
    mocks.salesProductRepository.findBySalesId.mockResolvedValue([
      { product: { id: 10, name: 'Produto', price: 5 }, quantity: 2 },
    ]);
    const result = await service.getAll();
    expect(result[0].customer[0].name).toBe('Cliente');
    expect(result[0].paymentMethod[0].name).toBe('Crédito');
    expect(result[0].items[0].quantity).toBe(2);
  });

  it('getById deve retornar venda detalhada', async () => {
    mocks.salesRepository.findById.mockResolvedValue({
      id: 1,
      customer: 1,
      paymentMethod: 2,
    });
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente',
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 2,
      name: 'Crédito',
    });
    mocks.salesProductRepository.findBySalesId.mockResolvedValue([
      { product: { id: 10, name: 'Produto', price: 5 }, quantity: 2 },
    ]);
    const result = await service.getById(1);
    expect(result?.customer[0].name).toBe('Cliente');
    expect(result?.paymentMethod[0].name).toBe('Crédito');
    expect(result?.items[0].quantity).toBe(2);
  });

  it('create deve criar uma venda', async () => {
    const salesDto: SalesDto = {
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.productRepository.findById.mockResolvedValue({
      id: 10,
      name: 'Produto',
      price: 5,
      quantity: 10,
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 2,
      name: 'Crédito',
    });
    mocks.salesRepository.create.mockResolvedValue({
      id: 1,
      customer: 1,
      paymentMethod: 2,
    });
    mocks.salesProductRepository.create.mockResolvedValue({});
    mocks.productRepository.update.mockResolvedValue({});
    mocks.salesRepository.findById.mockResolvedValue({
      id: 1,
      customer: 1,
      paymentMethod: 2,
    });
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente',
    });
    mocks.salesProductRepository.findBySalesId.mockResolvedValue([
      { product: { id: 10, name: 'Produto', price: 5 }, quantity: 2 },
    ]);
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 2,
      name: 'Crédito',
    });
    const result = await service.create(salesDto);
    expect(result?.id).toBe(1);
    expect(mocks.salesRepository.create).toHaveBeenCalled();
    expect(mocks.salesProductRepository.create).toHaveBeenCalled();
    expect(mocks.productRepository.update).toHaveBeenCalled();
  });

  it('update deve atualizar uma venda', async () => {
    const salesDto: SalesDto = {
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.salesRepository.findById.mockResolvedValue({
      id: 1,
      customer: 1,
      paymentMethod: 2,
    });
    mocks.productRepository.findById.mockResolvedValue({
      id: 10,
      name: 'Produto',
      price: 5,
      quantity: 10,
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 2,
      name: 'Crédito',
    });
    mocks.salesRepository.update.mockResolvedValue({});
    mocks.salesProductRepository.create.mockResolvedValue({});
    mocks.salesProductRepository.findBySalesId.mockResolvedValue([
      { product: { id: 10, name: 'Produto', price: 5 }, quantity: 2 },
    ]);
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente',
    });
    const result = await service.update(1, salesDto);
    expect(result?.id).toBe(1);
    expect(mocks.salesRepository.update).toHaveBeenCalled();
    expect(mocks.salesProductRepository.create).toHaveBeenCalled();
  });

  it('delete deve remover uma venda', async () => {
    mocks.salesRepository.findById.mockResolvedValue({ id: 1 });
    mocks.salesRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.salesRepository.delete).toHaveBeenCalledWith(1);
  });
});
