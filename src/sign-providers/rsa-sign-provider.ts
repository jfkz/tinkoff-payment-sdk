import * as crypto from 'crypto';
import { readFileSync } from 'fs';

import CryptoJS from 'crypto-js';

import { PayloadType } from '../common/payload-type';
import { SdkError } from '../common/sdk-error';
import { HttpRequest } from '../http-client/http-client';
import { SdkLogLevel } from '../logger/logger';
import { SignProvider } from './sign-provider';

export interface RSASignProviderOptions {
  privateKeyFile?: string;
  privateKeyString?: string;
  X509SerialNumber?: string;
  // certificateFile?: string;
}

const defaultOptions: Partial<RSASignProviderOptions> = {
};


/** https://acdn.tinkoff.ru/static/documents/merchant_api_protocoI_e2c.pdf */
export class RSASignProvider extends SignProvider {

  public signRequestPayload(payload: PayloadType): PayloadType {
    const DigestValue = this.digest(payload);

    const line = this.compactParameters(payload);

    this.log(SdkLogLevel.debug, 'RSA Sign Provider: compacted params: ', line);
    this.log(SdkLogLevel.debug, 'Digest value: ', DigestValue);

    const SignatureValue = this.signLine(line);

    return {
      ...payload,
      DigestValue,
      SignatureValue,
      X509SerialNumber: this.X509SerialNumber,
    };
  }

  private options: RSASignProviderOptions;

  private readonly privateKey!: Buffer;

  private readonly X509SerialNumber!: string;

  constructor(options: RSASignProviderOptions) {
    super();
    this.options = Object.assign({}, defaultOptions, (options || {}));

    if (this.options.privateKeyFile) {
      this.privateKey = readFileSync(this.options.privateKeyFile);
    }

    if (this.options.privateKeyString) {
      this.privateKey = Buffer.from(this.options.privateKeyString);
    }

    if (!this.privateKey) {
      throw new SdkError({
        message: 'Cant initialize RSA sign provider without private key. Set one of the options: privateKeyFile or privateKeyFile',
      });
    }

    if (this.options.X509SerialNumber) {
      this.X509SerialNumber = this.options.X509SerialNumber;
    }


    if (!this.X509SerialNumber) {
      throw new SdkError({
        message: 'Cant initialize RSA sign provider without X509SerialNumber. Please, set up this value in options',
      });
    }
  }

  public setFormType(request: HttpRequest): HttpRequest {
    return request;
  }

  protected digestLine(line: string): string {
    const data = CryptoJS.SHA256(line);
    return CryptoJS.enc.Base64.stringify(data);
  }

  protected signLine(line: string): string {

    const hash = crypto.createHash('SHA256').update(line).digest();

    const sign = crypto.createSign('RSA-SHA256').update(hash);

    return sign.sign(this.privateKey, 'base64');

  }
}