import { ApiManager } from '../api-client/api-manager';
import { PaymentStatus } from '../common/payment-status';
import { HttpClient, HttpRequest, HttpResponse, HttpRequestMethod } from '../http-client/http-client';

function makeHttpClient(responsePayload: Record<string, any>): HttpClient {
  return {
    sendRequest: jest.fn().mockResolvedValue({
      status: 200,
      payload: { ErrorCode: '0', Success: true, TerminalKey: 'test', Status: PaymentStatus.NEW, ...responsePayload },
    } as HttpResponse),
  };
}

const baseOptions = {
  terminalKey: 'TestTerminal',
  password: 'testpassword',
};

describe('ApiManager', () => {
  describe('initPayment', () => {
    it('should call Init endpoint with correct structure', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', PaymentId: 1, Amount: 100000 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      const result = await manager.initPayment({ OrderId: 'ord-1', Amount: 1000 });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      expect(sendRequest).toHaveBeenCalledTimes(1);
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('Init');
      expect(request.method).toBe(HttpRequestMethod.POST);
      expect(request.payload).toHaveProperty('TerminalKey', 'TestTerminal');
      expect(request.payload).toHaveProperty('Token');
      // Amount should be serialized to kopecks
      expect(request.payload).toHaveProperty('Amount', 100000);
      // Response Amount should be deserialized from kopecks
      expect(result.Amount).toBe(1000);
    });
  });

  describe('cancelPayment', () => {
    it('should call Cancel endpoint', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', PaymentId: 1 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.cancelPayment({ PaymentId: 1 });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('Cancel');
    });
  });

  describe('confirmPayment', () => {
    it('should call Confirm endpoint', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', PaymentId: 1, Amount: 10000 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.confirmPayment({ PaymentId: 1 });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('Confirm');
    });
  });

  describe('chargePayment', () => {
    it('should call Charge endpoint', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', PaymentId: 1, Amount: 10000 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.chargePayment({ PaymentId: 1, RebillId: 100 });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('Charge');
    });
  });

  describe('getState', () => {
    it('should call GetState endpoint', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', Amount: 10000 });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.getState({ PaymentId: '1' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('GetState');
    });
  });

  describe('getQr', () => {
    it('should call GetQr endpoint', async () => {
      const httpClient = makeHttpClient({ PaymentId: 1, Data: 'qrdata' });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.getQr({ PaymentId: 1 });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('GetQr');
    });
  });

  describe('getStaticQr', () => {
    it('should call GetStaticQr endpoint', async () => {
      const httpClient = makeHttpClient({ Data: 'staticqrdata' });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.getStaticQr({});

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('GetStaticQr');
    });
  });

  describe('checkOrder', () => {
    it('should call CheckOrder endpoint', async () => {
      const httpClient = makeHttpClient({ OrderId: 'ord-1', Payments: [] });
      const manager = new ApiManager({ ...baseOptions, httpClient });

      await manager.checkOrder({ OrderId: 'ord-1' });

      const sendRequest = httpClient.sendRequest as jest.Mock;
      const request: HttpRequest = sendRequest.mock.calls[0][0];
      expect(request.url).toContain('CheckOrder');
    });
  });

  describe('error handling', () => {
    it('should throw SdkError when API returns non-zero ErrorCode', async () => {
      const httpClient: HttpClient = {
        sendRequest: jest.fn().mockResolvedValue({
          status: 200,
          payload: {
            ErrorCode: '9999',
            Success: false,
            TerminalKey: 'test',
            Status: PaymentStatus.REJECTED,
            Message: 'Payment rejected',
          },
        } as HttpResponse),
      };

      const manager = new ApiManager({ ...baseOptions, httpClient });
      await expect(manager.getState({ PaymentId: '1' })).rejects.toThrow('Payment rejected');
    });
  });
});
