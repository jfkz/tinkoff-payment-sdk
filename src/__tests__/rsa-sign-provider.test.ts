import * as crypto from 'crypto';

import { SdkError } from '../common/sdk-error';
import { RSASignProvider } from '../sign-providers/rsa-sign-provider';

/** Generate a throwaway RSA key pair for testing */
function generateTestKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

const { privateKey } = generateTestKeyPair();
const testSerial = 'TEST_SERIAL_12345';

describe('RSASignProvider', () => {
  it('should throw SdkError when no private key is provided', () => {
    expect(
      () =>
        new RSASignProvider({
          X509SerialNumber: testSerial,
        }),
    ).toThrow(SdkError);
  });

  it('should throw SdkError when no X509SerialNumber is provided', () => {
    expect(
      () =>
        new RSASignProvider({
          privateKeyString: privateKey,
        }),
    ).toThrow(SdkError);
  });

  it('should initialize successfully with privateKeyString and X509SerialNumber', () => {
    expect(
      () =>
        new RSASignProvider({
          privateKeyString: privateKey,
          X509SerialNumber: testSerial,
        }),
    ).not.toThrow();
  });

  it('should sign a payload and add DigestValue, SignatureValue, X509SerialNumber', () => {
    const provider = new RSASignProvider({
      privateKeyString: privateKey,
      X509SerialNumber: testSerial,
    });

    const result = provider.signRequestPayload({ OrderId: '1', Amount: 1000 });

    expect(result).toHaveProperty('DigestValue');
    expect(result).toHaveProperty('SignatureValue');
    expect(result).toHaveProperty('X509SerialNumber', testSerial);
    expect(typeof result.DigestValue).toBe('string');
    expect(typeof result.SignatureValue).toBe('string');
  });

  it('should not set asForm on the request (JSON mode)', () => {
    const provider = new RSASignProvider({
      privateKeyString: privateKey,
      X509SerialNumber: testSerial,
    });

    const request: any = { url: 'https://example.com', payload: {} };
    provider.setFormType(request);
    expect(request.asForm).toBeUndefined();
  });

  it('should produce a consistent digest for the same payload', () => {
    const provider = new RSASignProvider({
      privateKeyString: privateKey,
      X509SerialNumber: testSerial,
    });

    const d1 = provider.digest({ OrderId: '1', Amount: 100 });
    const d2 = provider.digest({ OrderId: '1', Amount: 100 });
    expect(d1).toEqual(d2);
  });

  it('should produce different digests for different payloads', () => {
    const provider = new RSASignProvider({
      privateKeyString: privateKey,
      X509SerialNumber: testSerial,
    });

    const d1 = provider.digest({ OrderId: '1' });
    const d2 = provider.digest({ OrderId: '2' });
    expect(d1).not.toEqual(d2);
  });
});
