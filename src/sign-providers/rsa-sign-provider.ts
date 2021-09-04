import * as crypto from 'crypto';

import sha256 from 'crypto-js/sha256';

import { SignProvider } from './sign-provider';


export interface RSASignProviderOptions {
  publicKey: string;
}

const defaultOptions: Partial<RSASignProviderOptions> = {
};


/** https://acdn.tinkoff.ru/static/documents/merchant_api_protocoI_e2c.pdf */
export class RSASignProvider extends SignProvider {

  private options: RSASignProviderOptions;

  constructor(options: RSASignProviderOptions) {
    super();
    this.options = Object.assign({}, defaultOptions, (options || {}));
  }

  protected digestLine(line: string): string {
    const data = sha256(line);
    return CryptoJS.enc.Base64.stringify(data);
  }

  protected signLine(line: string): string {
    const encryptedData = crypto.publicEncrypt(
      {
        key: this.options.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(line)
    );
    return encryptedData.toString('base64');
  }
}