import 'reflect-metadata';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';

describe('CustomerService CRUD', () => {
  let service: CustomerService;
  let mocks: any;

  beforeEach(() => {
    mocks = {
      customerRepository: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new CustomerService(mocks.customerRepository as any);
  });

  it('getAll deve retornar todos os clientes', async () => {
    mocks.customerRepository.findAll.mockResolvedValue([
      { id: 1, name: 'Cliente 1' },
      { id: 2, name: 'Cliente 2' },
    ]);
    const result = await service.getAll();
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Cliente 1');
  });

  it('getById deve retornar um cliente', async () => {
    mocks.customerRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente 1',
    });
    const result = await service.getById(1);
    expect(result?.id).toBe(1);
    expect(result?.name).toBe('Cliente 1');
  });

  it('create deve criar um cliente', async () => {
    const dto: CustomerDto = { name: 'Novo Cliente' } as any;
    mocks.customerRepository.create.mockResolvedValue({
      id: 1,
      name: 'Novo Cliente',
    });
    const result = await service.create(dto);
    expect(result?.id).toBe(1);
    expect(mocks.customerRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update deve atualizar um cliente', async () => {
    const dto: CustomerDto = { name: 'Cliente Atualizado' } as any;
    mocks.customerRepository.update.mockResolvedValue({
      id: 1,
      name: 'Cliente Atualizado',
    });
    const result = await service.update(1, dto);
    expect(result?.name).toBe('Cliente Atualizado');
    expect(mocks.customerRepository.update).toHaveBeenCalledWith(1, dto);
  });

  it('delete deve remover um cliente', async () => {
    mocks.customerRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.customerRepository.delete).toHaveBeenCalledWith(1);
  });
});
