import 'reflect-metadata';
import { PaymentMethodService } from './payment-method.service';

const makeMocks = () => ({
  paymentMethodRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findInSalesById: jest.fn(),
  },
});

describe('PaymentMethodService', () => {
  let service: PaymentMethodService;
  let mocks: ReturnType<typeof makeMocks>;

  beforeEach(() => {
    mocks = makeMocks();
    service = new PaymentMethodService(mocks.paymentMethodRepository as any);
  });

  it('getAll deve retornar todos os métodos de pagamento', async () => {
    mocks.paymentMethodRepository.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await service.getAll();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('getById deve retornar o método de pagamento', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue({ id: 1 });
    const result = await service.getById(1);
    expect(result).toEqual({ id: 1 });
  });

  it('getById deve retornar undefined se não existir', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue(undefined);
    const result = await service.getById(1);
    expect(result).toBeUndefined();
  });

  it('create deve criar um método de pagamento', async () => {
    const dto = { name: 'Pix' };
    mocks.paymentMethodRepository.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mocks.paymentMethodRepository.create).toHaveBeenCalledWith(dto);
  });

  it('update deve atualizar um método de pagamento', async () => {
    const dto = { name: 'Débito' };
    mocks.paymentMethodRepository.findById.mockResolvedValue({ id: 1 });
    mocks.paymentMethodRepository.update.mockResolvedValue({ id: 1, ...dto });
    const result = await service.update(1, dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mocks.paymentMethodRepository.update).toHaveBeenCalledWith(1, {
      id: 1,
      ...dto,
    });
  });

  it('update deve lançar erro se método de pagamento não existir', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue(undefined);
    await expect(service.update(1, { name: 'X' } as any)).rejects.toThrow(
      'PaymentMethod with id 1 not found',
    );
  });

  it('delete deve remover um método de pagamento se não estiver associado a vendas', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue({ id: 1 });
    mocks.paymentMethodRepository.findInSalesById.mockResolvedValue(false);
    mocks.paymentMethodRepository.delete.mockResolvedValue(true);
    const result = await service.delete(1);
    expect(result).toBe(true);
    expect(mocks.paymentMethodRepository.delete).toHaveBeenCalledWith(1);
  });

  it('delete deve lançar erro se método de pagamento não existir', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue(undefined);
    await expect(service.delete(1)).rejects.toThrow(
      'Payment method with id 1 not found',
    );
    expect(mocks.paymentMethodRepository.delete).not.toHaveBeenCalled();
  });

  it('delete deve lançar erro se método de pagamento estiver associado a vendas', async () => {
    mocks.paymentMethodRepository.findById.mockResolvedValue({ id: 1 });
    mocks.paymentMethodRepository.findInSalesById.mockResolvedValue(true);
    await expect(service.delete(1)).rejects.toThrow(
      'Payment method with id 1 cannot be deleted because it is associated with sales',
    );
    expect(mocks.paymentMethodRepository.delete).not.toHaveBeenCalled();
  });
});
