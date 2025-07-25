import 'reflect-metadata';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodDto } from './dto/payment-method.dto';

describe('PaymentMethodService CRUD', () => {
  let service: PaymentMethodService;
  let mocks: any;

  beforeEach(() => {
    mocks = {
      paymentMethodRepository: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new PaymentMethodService(mocks.paymentMethodRepository as any);
  });

  it('getAll deve retornar todos os métodos de pagamento', async () => {
    mocks.paymentMethodRepository.findAll.mockResolvedValue([
      { id: 1, name: 'Dinheiro' },
      { id: 2, name: 'Crédito' },
    ]);
    const result = await service.getAll();
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Dinheiro');
  });

  it('getById deve retornar um método de pagamento', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue({
      id: 1,
      name: 'Dinheiro',
    });
    const result = await service.getById(1);
    expect(result?.id).toBe(1);
    expect(result?.name).toBe('Dinheiro');
  });

  it('create deve criar um método de pagamento', async () => {
    const dto: PaymentMethodDto = { name: 'Novo Método' } as any;
    mocks.paymentMethodRepository.create.mockResolvedValue({
      id: 1,
      name: 'Novo Método',
    });
    const result = await service.create(dto);
    expect(result?.id).toBe(1);
    expect(mocks.paymentMethodRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update deve atualizar um método de pagamento', async () => {
    const dto: PaymentMethodDto = { name: 'Método Atualizado' } as any;
    mocks.paymentMethodRepository.update.mockResolvedValue({
      id: 1,
      name: 'Método Atualizado',
    });
    const result = await service.update(1, dto);
    expect(result?.name).toBe('Método Atualizado');
    expect(mocks.paymentMethodRepository.update).toHaveBeenCalledWith(1, dto);
  });

  it('delete deve remover um método de pagamento', async () => {
    mocks.paymentMethodRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.paymentMethodRepository.delete).toHaveBeenCalledWith(1);
  });
});
