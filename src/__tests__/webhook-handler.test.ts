import { PaymentStatus } from '../common/payment-status';
import { SdkError } from '../common/sdk-error';
import { generateSignature } from '../common/signature';
import { WebhookHandler } from '../webhook-handler/webhook-handler';

const terminalKey = 'TinkoffBankTest';
const password = 'testpassword';

function buildValidPayload(overrides: Record<string, any> = {}) {
  const base: Record<string, any> = {
    TerminalKey: terminalKey,
    OrderId: 'order-1',
    Success: true,
    Status: PaymentStatus.CONFIRMED,
    PaymentId: '12345',
    ErrorCode: '0',
    Amount: '10000',
    CardId: '111',
    Pan: '430000******0777',
    ExpDate: '1225',
    ...overrides,
  };
  const token = generateSignature({ payload: base, password });
  return { ...base, Token: token };
}

describe('WebhookHandler', () => {
  let handler: WebhookHandler;

  beforeEach(() => {
    handler = new WebhookHandler({ terminalKey, password });
  });

  it('should successfully process a valid webhook request', () => {
    const payload = buildValidPayload() as any;
    const result = handler.handleWebhookRequest({ url: '/webhook', payload });
    expect(result.response.status).toBe(200);
    expect(result.payload.TerminalKey).toBe(terminalKey);
    expect(result.payload.OrderId).toBe('order-1');
  });

  it('should deserialize numeric string fields', () => {
    const payload = buildValidPayload() as any;
    const result = handler.handleWebhookRequest({ url: '/webhook', payload });
    expect(typeof result.payload.PaymentId).toBe('number');
    expect(result.payload.PaymentId).toBe(12345);
    expect(typeof result.payload.Amount).toBe('number');
  });

  it('should throw SdkError when payload is missing', () => {
    expect(() => handler.handleWebhookRequest({ url: '/webhook' })).toThrow(SdkError);
    expect(() => handler.handleWebhookRequest({ url: '/webhook' })).toThrow('Missing payload from the webhook request');
  });

  it('should throw SdkError when token is invalid', () => {
    const payload = { ...buildValidPayload(), Token: 'invalid-token' } as any;
    expect(() => handler.handleWebhookRequest({ url: '/webhook', payload })).toThrow(SdkError);
    expect(() => handler.handleWebhookRequest({ url: '/webhook', payload })).toThrow('Incorrect webhook request token');
  });

  it('should throw SdkError when terminal key does not match', () => {
    const payload = buildValidPayload({ TerminalKey: 'WrongTerminal' }) as any;
    // Recalculate token with wrong terminal key but same password
    const token = generateSignature({ payload, password });
    payload.Token = token;
    expect(() => handler.handleWebhookRequest({ url: '/webhook', payload })).toThrow(SdkError);
    expect(() => handler.handleWebhookRequest({ url: '/webhook', payload })).toThrow(
      'Incorrect webhook request terminal key',
    );
  });
});
