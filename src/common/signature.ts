
import { createHash } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gostCrypto, gostEngine } = require('node-gost-crypto');


/**
 * Generates signature for the specified request payload,
 * using the specified password.
 *
 * See: {@link https://oplata.tinkoff.ru/develop/api/request-sign/ signature generation rules}
 */
export function generateSignature(options: {
  payload: any;
  password: string;

}): string {

  const { password, payload } = options;

  const signData = {
    ...payload,
    Password: password,
  };

  const ignoredKeys = [
    'Token',
    'Receipt',
    'DATA',
  ];

  const signString = Object.keys(signData)
    .filter(key => !ignoredKeys.includes(key))
    .sort()
    .map(key => signData[key])
    .join('')
  ;

  return createHash('sha256')
    .update(signString)
    .digest('hex')
  ;

}


export function signRequestPayload<PayloadType>(options: {
  payload: PayloadType;
  password: string;

}): (PayloadType & { Token: string }) {

  const { payload, password } = options;

  return {
    ...payload,
    Token: generateSignature({
      payload,
      password,
    }),
  };

}

export function sign3411(line: string): string {
  const buffer = Buffer.from(line);

  const digest = gostEngine.getGostDigest({ name: 'GOST R 34.11', length: 256, version: 2012 });
  return Buffer.from(digest.digest(buffer)).toString('hex');
}

export function sign3410(line: string): string {
  const buffer = Buffer.from(line);

  const digest = gostEngine.getGostDigest({ name: 'GOST R 34.10', length: 256, version: 2012, mode: 'CPKDF' });
  return Buffer.from(digest.digest(buffer)).toString('hex');
}

export async function sign3411async(line: string): Promise<string> {
  const buffer = Buffer.from(line);

  const arrayBuffer = await gostCrypto.subtle.digest('GOST R 34.11-12-256', buffer);
  return Buffer.from(arrayBuffer).toString('hex');
}

export async function sign3410async(line: string): Promise<string> {
  const buffer = Buffer.from(line);

  const arrayBuffer = await gostCrypto.subtle.digest('GOST R 34.10-12-256', buffer);
  return Buffer.from(arrayBuffer).toString('hex');
}
