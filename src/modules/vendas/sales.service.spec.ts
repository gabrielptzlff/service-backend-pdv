import 'reflect-metadata';
import { SalesService } from './sales.service';
import { SalesDto } from './dto/sales.dto';
import { UpdateSalesDto } from './dto/update-sales.dto';

const makeMocks = () => ({
  salesRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customerRepository: { findById: jest.fn() },
  salesProductRepository: {
    findBySalesId: jest.fn(),
    create: jest.fn(),
    deleteBySalesId: jest.fn(),
  },
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

  it('getAll deve retornar todas as vendas', async () => {
    mocks.salesRepository.findAll.mockResolvedValue([
      { id: 1, customer: [], paymentMethod: [], products: [{}] },
    ]);
    const result = await service.getAll();
    expect(result).toEqual([{ id: 1, customer: [], paymentMethod: [] }]);
  });

  it('getById deve retornar a venda', async () => {
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
      name: 'Pix',
    });
    mocks.salesProductRepository.findBySalesId.mockResolvedValue([]);
    const result = await service.getById(1);
    expect(result!.id).toBe(1);
    expect(result!.customer[0].name).toBe('Cliente');
    expect(result!.paymentMethod[0].name).toBe('Pix');
  });

  it('getById deve retornar undefined se não existir', async () => {
    mocks.salesRepository.findById.mockResolvedValue(undefined);
    const result = await service.getById(1);
    expect(result).toBeNull();
  });

  it('create deve criar uma venda', async () => {
    const dto: SalesDto = {
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente',
    });
    mocks.productRepository.findById.mockResolvedValue({
      id: 10,
      price: 5,
      quantity: 10,
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue({ id: 2 });
    mocks.salesRepository.create.mockResolvedValue({
      id: 1,
      customer: [
        {
          id: 1,
          name: 'Cliente',
          email: 'teste@gmail.com',
          postalCode: null,
          street: null,
          number: null,
          complement: null,
          neighborhood: null,
          city: null,
          state: null,
        },
      ],
      paymentMethod: [
        {
          id: 2,
          name: 'Pix',
          installments: 1,
        },
      ],
      totalPrice: '19.0000',
      products: [
        {
          id: 1,
          product_id: 10,
          sales_id: 1,
          quantity: 2,
          unit_price: '5.0000',
        },
      ],
    });
    mocks.salesRepository.findById.mockResolvedValue({
      id: 1,
      customer: 1,
      paymentMethod: 2,
      totalPrice: '19.0000',
    });

    const result = await service.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.id).toBe(1);
    expect(mocks.salesRepository.create).toHaveBeenCalled();
    expect(mocks.salesProductRepository.create).toHaveBeenCalled();
  });

  it('create deve lançar erro se cliente não existir', async () => {
    const dto: SalesDto = {
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.customerRepository.findById.mockResolvedValue(undefined);
    mocks.paymentMethodRepository.findById.mockResolvedValue({ id: 2 });
    mocks.productRepository.findById.mockResolvedValue([
      { id: 10, quantity: 2 },
    ]);
    await expect(service.create(dto)).rejects.toThrow(
      'Customer with id 1 not found',
    );
  });

  it('create deve lançar erro se produto não existir', async () => {
    const dto: SalesDto = {
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.customerRepository.findById.mockResolvedValue({ id: 1 });
    mocks.productRepository.findById.mockResolvedValue(undefined);
    await expect(service.create(dto)).rejects.toThrow(
      'Product with id 10 not found',
    );
  });

  it('create deve lançar erro se método de pagamento não existir', async () => {
    const dto: SalesDto = {
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.customerRepository.findById.mockResolvedValue({ id: 1 });
    mocks.productRepository.findById.mockResolvedValue({
      id: 10,
      price: 5,
      quantity: 10,
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue(undefined);
    await expect(service.create(dto)).rejects.toThrow(
      'Payment method with id 2 not found',
    );
  });

  it('update deve atualizar uma venda', async () => {
    const updateSalesDto: UpdateSalesDto = {
      id: 1,
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
      name: 'Coca Cola Lata',
      price: 5,
      quantity: 10,
    });
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 2,
      name: 'Débito',
    });
    mocks.salesRepository.update.mockResolvedValue({});
    mocks.salesProductRepository.create.mockResolvedValue({});
    mocks.salesProductRepository.deleteBySalesId.mockResolvedValue({ id: 1 });
    mocks.salesProductRepository.findBySalesId.mockResolvedValue([
      { product: { id: 10, name: 'Coca Cola Lata', price: 5 }, quantity: 2 },
    ]);
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente',
    });
    const result = await service.update(1, updateSalesDto);
    expect(result?.id).toBe(1);
    expect(mocks.salesRepository.update).toHaveBeenCalled();
    expect(mocks.salesProductRepository.create).toHaveBeenCalled();
  });

  it('update deve lançar erro se venda não existir', async () => {
    const updateSalesDto: UpdateSalesDto = {
      id: 1,
      customerId: 1,
      paymentMethodId: 2,
      products: [{ id: 10, quantity: 2 }],
    };
    mocks.salesRepository.findById.mockResolvedValue(undefined);
    await expect(service.update(1, updateSalesDto)).rejects.toThrow(
      'Sale with id 1 not found',
    );
  });

  it('delete deve remover uma venda', async () => {
    mocks.salesRepository.findById.mockResolvedValue({ id: 1 });
    mocks.salesRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.salesRepository.delete).toHaveBeenCalledWith(1);
  });

  it('delete deve lançar erro se venda não existir', async () => {
    mocks.salesRepository.findById.mockResolvedValue(undefined);
    await expect(service.delete(1)).rejects.toThrow('Sale not found');
    expect(mocks.salesRepository.delete).not.toHaveBeenCalled();
  });
});
