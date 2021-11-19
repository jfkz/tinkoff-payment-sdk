
import { URL } from 'url';

import { BaseResponsePayload } from '../..';
import { signRequestPayload } from '../../common/signature';
import { HttpClient, HttpRequest, HttpResponse } from '../../http-client/http-client';
import { SdkLogger, SdkLogLevel } from '../../logger/logger';
import { Schema } from '../../serialization/schema';
import { serializeData } from '../../serialization/serializer';

export interface ApiClientOptions {
  httpClient: HttpClient;
  terminalKey: string;
  password: string;
  baseUrl?: string;
  userAgent?: string;
  logger?: SdkLogger;
}

export abstract class BaseClient {

  protected readonly options: ApiClientOptions;

  constructor(options: ApiClientOptions, defaultOptions: Partial<ApiClientOptions> = {}) {
    this.options = Object.assign({}, defaultOptions, (options || {}));
  }

  public abstract sendRequest<ResponsePayloadType extends BaseResponsePayload>(options: {
    request: HttpRequest;
    requestSchema: Schema;
    responseSchema: Schema;
    skipVerification?: boolean;
  }): Promise<HttpResponse<ResponsePayloadType>>

  protected applyBaseUrl(request: HttpRequest): void {
    const { baseUrl } = this.options;
    request.url = (new URL(request.url, baseUrl)).toString();
  }

  protected serializeRequest(request: HttpRequest, schema: Schema): void {
    request.payload = serializeData({
      data: request.payload,
      schema,
    });
  }

  protected serializeForm(request: HttpRequest, schema: Schema): void {
    request.payload = serializeData({
      data: request.payload,
      schema,
    });
  }

  protected deserializeResponse(response: HttpResponse, schema: Schema): void {
    response.payload = serializeData({
      data: response.payload,
      schema,
      ignoreMissing: true,
    });
  }

  protected addSignatureToken(request: HttpRequest): void {

    const { password } = this.options;

    request.payload = signRequestPayload({
      payload: request.payload,
      password,
    });

  }

  protected addTerminalKey(request: HttpRequest): void {

    const { terminalKey } = this.options;

    Object.assign(request.payload, {
      TerminalKey: terminalKey,
    });

  }

  protected handleHeaders(request: HttpRequest): void {

    const { userAgent } = this.options;

    const defaultHeaders = {
      'user-agent': userAgent,
    };

    request.headers = Object.assign(
      {},
      defaultHeaders,
      (request.headers || {})
    );

  }

  protected log(level: SdkLogLevel, ...args: any[]): void{
    if (this.options.logger) {
      const logger = this.options.logger;
      switch (level) {
      case SdkLogLevel.debug:
        if (logger.debug instanceof Function) {
          logger.debug(...args);
        }
        break;
      case SdkLogLevel.error:
        if (logger.error instanceof Function) {
          logger.error(...args);
        }
        break;
      case SdkLogLevel.info:
        if (logger.info instanceof Function) {
          logger.info(...args);
        }
        break;
      case SdkLogLevel.log:
        if (logger.log instanceof Function) {
          logger.log(...args);
        }
        break;
      case SdkLogLevel.warn:
        if (logger.warn instanceof Function) {
          logger.warn(...args);
        }
        break;
      }
    }
  }

}