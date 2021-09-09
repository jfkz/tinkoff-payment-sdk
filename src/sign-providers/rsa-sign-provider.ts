import * as crypto from 'crypto';
import { readFileSync } from 'fs';

import CryptoJS from 'crypto-js';

import { PayloadType } from '../common/payload-type';
import { SignProvider } from './sign-provider';

export interface RSASignProviderOptions {
  publicKey: string;
}

const defaultOptions: Partial<RSASignProviderOptions> = {
};


/** https://acdn.tinkoff.ru/static/documents/merchant_api_protocoI_e2c.pdf */
export class RSASignProvider extends SignProvider {

  public signRequestPayload(payload: PayloadType): PayloadType {
    const DigestValue = this.digest(payload);

    const line = this.compactParameters(payload);

    const SignatureValue = this.sign(line);

    return {
      ...payload,
      DigestValue,
      SignatureValue,
    };
  }

  private options: RSASignProviderOptions;

  constructor(options: RSASignProviderOptions) {
    super();
    this.options = Object.assign({}, defaultOptions, (options || {}));
  }

  protected digestLine(line: string): string {
    const data = CryptoJS.SHA256(line);
    return CryptoJS.enc.Base64.stringify(data);
  }

  protected signLine(line: string): string {
    const key = readFileSync(this.options.publicKey);
    const encryptedData = crypto.publicEncrypt(
      {
        key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(line)
    );
    return encryptedData.toString('base64');
  }
}