import { ApiManager } from '../api-client/api-manager';
import { ApiManagerSafeDeal } from '../api-client/api-manager';
import { ApiManagerMerchant } from '../api-client/api-manager';
import { PayloadType } from '../common/payload-type';
import { PaymentStatus } from '../common/payment-status';
import { HttpClient, HttpResponse } from '../http-client/http-client';
import { SignProvider } from '../sign-providers/sign-provider';

function makeHttpClient(responsePayload: Record<string, any>): HttpClient {
  return {
    sendRequest: jest.fn().mockResolvedValue({
      status: 200,
      payload: {
        ErrorCode: '0',
        Success: true,
        TerminalKey: 'test',
        Status: PaymentStatus.NEW,
        ...responsePayload,
      },
    } as HttpResponse),
  };
}

const baseOptions = {
  terminalKey: 'TestTerminal',
  password: 'testpassword',
};

describe('ApiManager – remaining methods', () => {
  describe('addCustomer', () => {
    it('should call AddCustomer endpoint', async () => {
      const httpClient = makeHttpClient({ CustomerKey: 'cust-1' });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.addCustomer({ CustomerKey: 'cust-1' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('AddCustomer');
    });
  });

  describe('getCustomer', () => {
    it('should call GetCustomer endpoint', async () => {
      const httpClient = makeHttpClient({ CustomerKey: 'cust-1' });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.getCustomer({ CustomerKey: 'cust-1' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('GetCustomer');
    });
  });

  describe('removeCustomer', () => {
    it('should call RemoveCustomer endpoint', async () => {
      const httpClient = makeHttpClient({ CustomerKey: 'cust-1' });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.removeCustomer({ CustomerKey: 'cust-1' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('RemoveCustomer');
    });
  });

  describe('resend', () => {
    it('should call Resend endpoint without PaymentId', async () => {
      const httpClient = makeHttpClient({ Count: 0 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.resend({});

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('Resend');
    });

    it('should throw when PaymentId is provided without NotificationTypes', async () => {
      const httpClient = makeHttpClient({ Count: 0 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await expect(manager.resend({ PaymentId: 1 })).rejects.toThrow('NotificationTypes is required');
    });
  });

  describe('sendClosingReceipt', () => {
    it('should call sendClosingReceipt endpoint', async () => {
      const httpClient = makeHttpClient({ Success: true, ErrorCode: '0' });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.sendClosingReceipt({
        PaymentId: 1,
        Receipt: {
          Taxation: 'osn' as any,
          Items: [{ Name: 'Item', Price: 10, Quantity: 1, Tax: 'none' as any }],
        },
      });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('sendClosingReceipt');
    });
  });

  describe('finishAuthorize', () => {
    it('should call FinishAuthorize endpoint', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', PaymentId: 1, Amount: 10000 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.finishAuthorize({ PaymentId: 1, EncryptedPaymentData: 'encdata' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('FinishAuthorize');
    });
  });

  describe('getCardList', () => {
    it('should call GetCardList endpoint and return array', async () => {
      const httpClient: HttpClient = {
        sendRequest: jest.fn().mockResolvedValue({
          status: 200,
          payload: [{ Pan: '4300**1111', CardId: 1, Status: 'A', RebillId: '', CardType: 0 }],
        }),
      };
      const manager = new ApiManager({ ...baseOptions, httpClient });

      const result = await manager.getCardList({ CustomerKey: 'cust-1' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest.mock.calls[0][0].url).toContain('GetCardList');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('with logger', () => {
    it('should invoke logger methods when logger is provided', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', PaymentId: 1, Amount: 10000 });
      const debugCalls: unknown[][] = [];
      const logger = {
        debug: function (...args: unknown[]) {
          debugCalls.push(args);
        },
      };
      const manager = new ApiManager({ ...baseOptions, httpClient, logger });

      await manager.initPayment({ OrderId: 'ord-1', Amount: 10 });

      expect(debugCalls.length).toBeGreaterThanOrEqual(2); // request + response
    });
  });
});

describe('ApiManagerSafeDeal', () => {
  const makeClient = (extra: Record<string, any> = {}) =>
    makeHttpClient({ ErrorCode: '0', Success: true, TerminalKey: 'test', Status: PaymentStatus.NEW, ...extra });

  it('should expose addCard', async () => {
    const httpClient = makeClient({ CustomerKey: 'cust-1', RequestKey: 'req-1' });
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    await manager.addCard({ CustomerKey: 'cust-1' });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('AddCard');
  });

  it('should expose removeCard', async () => {
    const httpClient = makeClient({ CustomerKey: 'cust-1' });
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    await manager.removeCard({ CustomerKey: 'cust-1', CardId: 1 });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('RemoveCard');
  });

  it('should expose getCardList', async () => {
    const httpClient: HttpClient = {
      sendRequest: jest.fn().mockResolvedValue({
        status: 200,
        payload: [{ Pan: '4300**1111', CardId: 1, Status: 'A', RebillId: '', CardType: 0 }],
      }),
    };
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    const result = await manager.getCardList({ CustomerKey: 'cust-1' });
    expect(Array.isArray(result)).toBe(true);
  });

  it('should expose getState', async () => {
    const httpClient = makeClient({ OrderId: 'ord-1' });
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    await manager.getState({ PaymentId: '1' });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('GetState');
  });

  it('should expose createSpDeal', async () => {
    const httpClient = makeClient({ SpAccumulationId: 'sp-1' });
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    await manager.createSpDeal({ SpDealType: 'N1' });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('createSpDeal');
  });

  it('should expose closeSpDeal', async () => {
    const httpClient = makeClient({});
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    await manager.closeSpDeal({ SpAccumulationId: 'sp-1' });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('closeSpDeal');
  });

  it('should expose payment', async () => {
    const httpClient = makeClient({ OrderId: 'ord-1', PaymentId: 1 });
    const manager = new ApiManagerSafeDeal({ ...baseOptions, httpClient });
    await manager.payment({ PaymentId: 1 });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('Payment');
  });
});

describe('ApiManagerMerchant', () => {
  function makeSignProvider(): SignProvider {
    return {
      signRequestPayload: jest.fn((payload: PayloadType) => ({
        ...payload,
        DigestValue: 'digest',
        SignatureValue: 'sig',
        X509SerialNumber: 'serial',
      })),
      setFormType: jest.fn((request: any) => {
        request.asForm = true;
        return request;
      }),
      digest: jest.fn(() => 'digest'),
      sign: jest.fn(() => 'sig'),
    } as unknown as SignProvider;
  }

  it('should expose addCard and use sign provider', async () => {
    const httpClient = makeHttpClient({ CustomerKey: 'cust-1', RequestKey: 'req-1' });
    const signProvider = makeSignProvider();
    const manager = new ApiManagerMerchant({ ...baseOptions, httpClient }, signProvider);
    await manager.addCard({ CustomerKey: 'cust-1' });
    expect(signProvider.signRequestPayload).toHaveBeenCalled();
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('AddCard');
  });

  it('should expose getState', async () => {
    const httpClient = makeHttpClient({ OrderId: 'ord-1' });
    const signProvider = makeSignProvider();
    const manager = new ApiManagerMerchant({ ...baseOptions, httpClient }, signProvider);
    await manager.getState({ PaymentId: '1' });
    const sendRequest = httpClient.sendRequest as jest.Mock;
    expect(sendRequest.mock.calls[0][0].url).toContain('GetState');
  });
});
