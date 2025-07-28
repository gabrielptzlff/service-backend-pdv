import 'reflect-metadata';
import { CustomerService } from './customer.service';

const makeMocks = () => ({
  customerRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findInSalesById: jest.fn(),
  },
});

describe('CustomerService', () => {
  let service: CustomerService;
  let mocks: ReturnType<typeof makeMocks>;

  beforeEach(() => {
    mocks = makeMocks();
    service = new CustomerService(mocks.customerRepository as any);
  });

  it('getAll deve retornar todos os clientes', async () => {
    mocks.customerRepository.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await service.getAll();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('getById deve retornar o cliente', async () => {
    mocks.customerRepository.findById.mockResolvedValue({ id: 1 });
    const result = await service.getById(1);
    expect(result).toEqual({ id: 1 });
  });

  it('getById deve retornar undefined se não existir', async () => {
    mocks.customerRepository.findById.mockResolvedValue(undefined);
    const result = await service.getById(1);
    expect(result).toBeUndefined();
  });

  it('create deve criar um cliente', async () => {
    const dto = { name: 'Cliente' };
    mocks.customerRepository.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mocks.customerRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update deve atualizar um cliente', async () => {
    const dto = { name: 'Atualizado' };
    mocks.customerRepository.findById.mockResolvedValue({ id: 1 });
    mocks.customerRepository.update.mockResolvedValue({ id: 1, ...dto });
    const result = await service.update(1, dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mocks.customerRepository.update).toHaveBeenCalledWith(1, {
      id: 1,
      ...dto,
    });
  });

  it('update deve lançar erro se cliente não existir', async () => {
    mocks.customerRepository.findById.mockResolvedValue(undefined);
    await expect(service.update(1, { name: 'X' } as any)).rejects.toThrow(
      'Customer with id 1 not found',
    );
  });

  it('delete deve remover um cliente se não estiver associado a vendas', async () => {
    mocks.customerRepository.findById.mockResolvedValue({ id: 1 });
    mocks.customerRepository.findInSalesById.mockResolvedValue(false);
    mocks.customerRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.customerRepository.delete).toHaveBeenCalledWith(1);
  });

  it('delete deve lançar erro se cliente não existir', async () => {
    mocks.customerRepository.findById.mockResolvedValue(undefined);
    await expect(service.delete(1)).rejects.toThrow(
      'Customer with id 1 not found',
    );
    expect(mocks.customerRepository.delete).not.toHaveBeenCalled();
  });

  it('delete deve lançar erro se cliente estiver associado a vendas', async () => {
    mocks.customerRepository.findById.mockResolvedValue({ id: 1 });
    mocks.customerRepository.findInSalesById.mockResolvedValue(true);
    await expect(service.delete(1)).rejects.toThrow(
      'Customer with id 1 cannot be deleted because it is associated with sales',
    );
    expect(mocks.customerRepository.delete).not.toHaveBeenCalled();
  });
});
