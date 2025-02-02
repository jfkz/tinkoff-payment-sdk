import { generateSignature, signRequestPayload } from './signature';

describe('generateSignature', () => {
  it('should generate a valid signature for the given payload and password', () => {
    const payload = { OrderId: '12345', Amount: 1000 };
    const password = 'test_password';
    const signature = generateSignature({ payload, password });
    expect(signature).toBe('expected_signature'); // Replace 'expected_signature' with the actual expected signature
  });

  it('should ignore specified keys when generating the signature', () => {
    const payload = { OrderId: '12345', Amount: 1000, Token: 'token', Receipt: 'receipt', DATA: 'data' };
    const password = 'test_password';
    const signature = generateSignature({ payload, password });
    expect(signature).toBe('expected_signature'); // Replace 'expected_signature' with the actual expected signature
  });
});

describe('signRequestPayload', () => {
  it('should add a valid Token to the payload', () => {
    const payload = { OrderId: '12345', Amount: 1000 };
    const password = 'test_password';
    const signedPayload = signRequestPayload({ payload, password });
    expect(signedPayload.Token).toBe('expected_signature'); // Replace 'expected_signature' with the actual expected signature
    expect(signedPayload.OrderId).toBe(payload.OrderId);
    expect(signedPayload.Amount).toBe(payload.Amount);
  });

  it('should not modify the original payload', () => {
    const payload = { OrderId: '12345', Amount: 1000 };
    const password = 'test_password';
    const signedPayload = signRequestPayload({ payload, password });
    expect(signedPayload).not.toBe(payload);
    expect(payload).toEqual({ OrderId: '12345', Amount: 1000 });
  });
});
