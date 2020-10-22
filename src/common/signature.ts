
import { createHash } from 'crypto';

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
