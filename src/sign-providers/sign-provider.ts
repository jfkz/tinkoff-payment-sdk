
import * as _ from 'lodash';

import { PayloadType } from '../common/payload-type';
import { HttpRequest } from '../http-client/http-client';
import { Loggable } from '../logger/logger';

export abstract class SignProvider extends Loggable {

  public abstract signRequestPayload(payload: PayloadType): PayloadType;

  protected abstract digestLine(line: string): string;
  protected abstract signLine(line: string): string;

  public setFormType(request: HttpRequest): HttpRequest {
    request.asForm = true;
    return request;
  }

  protected compactParameters(payload: PayloadType): string {
    const exludeFields = [
      // Documented fields
      'DigestValue',
      'SignatureValue',
      'X509SerialNumber',
      // Undocumented fields
      // 'Description',
      // 'PayForm',
    ];

    if (payload.DATA && typeof payload.DATA !== 'string') {
      exludeFields.push('DATA');
    }

    const line = _.keys(payload)
      .filter((key) => {
        return !exludeFields.includes(key);
      })
      .sort()
      .reduce((l, key) => {
        return l + payload[key];
      }, '');
    return line;
  }

  public digest(payload: PayloadType): string {
    const line = this.compactParameters(payload);
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