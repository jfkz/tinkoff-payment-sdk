
import * as _ from 'lodash';

type PayloadType = any;

export abstract class SignProvider {

  protected abstract digestLine(line: string): string;
  protected abstract signLine(line: string): string;

  public digest(payload: PayloadType): string {
    const exludeFields = [
      // Documented fields
      'DigestValue',
      'SignatureValue',
      'X509SerialNumber',
      // Undocumented fields
      'Description',
      'PayForm',
      'DATA',
    ];

    const line = _.keys(payload)
      .filter((key) => {
        return !exludeFields.includes(key);
      })
      .sort()
      .reduce((l, key) => {
        return l + payload[key];
      }, '');

    return this.digestLine(line);
  }

  /**
   * Return sign by line. Check options to set up parameters
   * @param hash base64 encoded line
   */
  public sign (hash: string): string {
    return this.signLine(hash);
  }
}