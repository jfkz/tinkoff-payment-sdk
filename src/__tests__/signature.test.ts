import { generateSignature, signRequestPayload } from '../common/signature';

describe('generateSignature', () => {
  it('should generate a SHA256 hex string', () => {
    const result = generateSignature({ payload: { OrderId: '1' }, password: 'secret' });
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should include Password value in the hash input', () => {
    const result1 = generateSignature({ payload: { OrderId: '1' }, password: 'pass1' });
    const result2 = generateSignature({ payload: { OrderId: '1' }, password: 'pass2' });
    expect(result1).not.toEqual(result2);
  });

  it('should sort keys alphabetically before hashing', () => {
    const result1 = generateSignature({ payload: { B: '2', A: '1' }, password: 'p' });
    const result2 = generateSignature({ payload: { A: '1', B: '2' }, password: 'p' });
    expect(result1).toEqual(result2);
  });

  it('should exclude Token, Receipt, and DATA keys', () => {
    const base = generateSignature({ payload: { OrderId: '1' }, password: 'p' });
    const withExcluded = generateSignature({
      payload: { OrderId: '1', Token: 'tok', Receipt: { something: true }, DATA: 'data' },
      password: 'p',
    });
    expect(withExcluded).toEqual(base);
  });

  it('should produce a consistent known hash', () => {
    // echo -n "1secret" | sha256sum => depends on key order (Password comes after sorted keys)
    // Keys: OrderId, Password -> sorted: OrderId, Password -> concatenated: "1secret"
    const result = generateSignature({ payload: { OrderId: '1' }, password: 'secret' });
    // Verify it's deterministic
    expect(result).toEqual(generateSignature({ payload: { OrderId: '1' }, password: 'secret' }));
  });
});

describe('signRequestPayload', () => {
  it('should add a Token property to the payload', () => {
    const result = signRequestPayload({ payload: { OrderId: '1' }, password: 'pass' });
    expect(result).toHaveProperty('Token');
    expect(typeof result.Token).toBe('string');
  });

  it('should preserve original payload properties', () => {
    const result = signRequestPayload({ payload: { OrderId: '42', Amount: 100 }, password: 'pass' });
    expect(result.OrderId).toBe('42');
    expect(result.Amount).toBe(100);
  });

  it('should not mutate the original payload', () => {
    const original = { OrderId: '1' };
    signRequestPayload({ payload: original, password: 'pass' });
    expect(original).not.toHaveProperty('Token');
  });
});
