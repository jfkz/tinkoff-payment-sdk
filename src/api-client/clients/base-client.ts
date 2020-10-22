
import { URL } from 'url';

import { signRequestPayload } from '../../common/signature';
import { HttpClient, HttpRequest, HttpResponse } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { serializeData } from '../../serialization/serializer';
import { ResponsePayload } from '../response-payload';

export interface ApiClientOptions {
  httpClient: HttpClient;
  terminalKey: string;
  password: string;
  baseUrl?: string;
  userAgent?: string;
}

export abstract class BaseClient {

  protected readonly options: ApiClientOptions;

  constructor(options: ApiClientOptions, defaultOptions: Partial<ApiClientOptions> = {}) {
    this.options = Object.assign({}, defaultOptions, (options || {}));
  }

  public abstract async sendRequest<ResponsePayloadType extends ResponsePayload>(options: {
    request: HttpRequest;
    requestSchema: Schema;
    responseSchema: Schema;
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

  protected switchToForm(request: HttpRequest): void {
    request.asForm = true;
  }

}