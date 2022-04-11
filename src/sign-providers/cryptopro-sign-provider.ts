
import { execSync } from 'child_process';
import * as fs from 'fs';
import { dirname } from 'path';

import tmp from 'tmp';

import { flatDataObject } from '../api-client/requests/common/data';
import { PayloadType } from '../common/payload-type';
import { SignProvider } from './sign-provider';

// https://cpdn.cryptopro.ru/content/csp40/html/group___pro_c_s_p_ex_DP8.html
type THashAlgorithm = '1.2.643.7.1.1.2.2' | '1.2.643.7.1.1.2.3' | '1.2.643.2.2.9';
type TSignAlgorithm = 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512' | 'MD5' | 'MD2' | 'MD4'
  | 'GOST12_256' | 'GOST12_512' | 'GOST94_256';

export interface CryptoProSignProviderOptions {
  cpContainerPassword: string;
  cpContainer: string;
  cpHashAlg?: THashAlgorithm;
  cpSingAlg?: TSignAlgorithm;
  cpLocation?: string;
  cpHideExceptions?: boolean;
}

const defaultOptions: Partial<CryptoProSignProviderOptions> = {
  cpLocation: '/opt/cprocsp/bin/amd64',
  cpHashAlg: '1.2.643.7.1.1.2.2',
  cpSingAlg: 'GOST12_256',
  cpHideExceptions: true,
};

export class CryptoProSignProvider extends SignProvider {

  public signRequestPayload(payload: PayloadType): PayloadType {
    if (payload.DATA) {
      payload.DATA = flatDataObject(payload.DATA);
    }

    const DigestValue = this.digest(payload);

    const SignatureValue = this.sign(DigestValue);

    return {
      ...payload,
      DigestValue,
      SignatureValue,
      X509SerialNumber: 1,
    };
  }

  private options: CryptoProSignProviderOptions;

  constructor(options: CryptoProSignProviderOptions) {
    super();
    this.options = Object.assign({}, defaultOptions, options);
  }

  protected digestLine(line: string): string {
    const tmpFilename = tmp.tmpNameSync();
    const hashFilename = `${tmpFilename}.hsh`;
    const {
      cpLocation: cryptoProDir,
      cpHashAlg: hashAlg,
      cpHideExceptions: hideExceptions,
    } = this.options;
    const cmdOptions = [
      `${cryptoProDir}/cryptcp`,
      '-hash',
      `-hashAlg ${hashAlg}`,
      `-dir ${dirname(tmpFilename)}`,
      tmpFilename,
    ];
    const hashCmd = cmdOptions.join(' ');
    let hash = '';
    try {
      fs.writeFileSync(tmpFilename, line);
      execSync(hashCmd);
      hash = fs.readFileSync(hashFilename).toString('base64');
      fs.unlinkSync(tmpFilename);
      fs.unlinkSync(hashFilename);
    } catch (err) {
      if (!hideExceptions) {
        throw err;
      }
    }
    return hash;
  }

  protected signLine(hash: string): string {
    const tmpFilename = tmp.tmpNameSync();
    const hashFilename = `${tmpFilename}.hsh`;
    const signFilename = `${tmpFilename}.sig`;
    const {
      cpLocation: cryptoProDir,
      cpSingAlg: singAlg,
      cpHideExceptions: hideExceptions,
      cpContainer: container,
      cpContainerPassword: containerPassword,
    } = this.options;
    const cmdOptions = [
      `${cryptoProDir}/csptest`,
      '-keyset',
      `-sign ${singAlg}`,
      `-cont '${container}'`,
      '-keytype exchange',
      `-in ${hashFilename}`,
      `-out ${signFilename}`,
      `-password ${containerPassword}`,
    ];
    const signCmd = cmdOptions.join(' ');
    let sign = '';
    try {
      fs.writeFileSync(hashFilename, Buffer.from(hash, 'base64'));
      execSync(signCmd);
      sign = fs.readFileSync(signFilename).toString('base64');
      fs.unlinkSync(hashFilename);
      fs.unlinkSync(signFilename);
    } catch (err) {
      if (!hideExceptions) {
        throw err;
      }
    }
    return sign;
  }
}
