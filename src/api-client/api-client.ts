
import { URL } from 'url';

import { SdkError } from '../common/sdk-error';
import { signRequestPayload } from '../common/signature';
import { HttpClient, HttpRequest, HttpResponse } from '../http-client/http-client';
import { Schema } from '../serialization/schema';
import { serializeData } from '../serialization/serializer';
import { ResponsePayload } from './response-payload';


export interface ApiClientOptions {
  httpClient: HttpClient;
  terminalKey: string;
  password: string;
  baseUrl?: string;
  userAgent?: string;
}


const defaultOptions: Partial<ApiClientOptions> = {
  baseUrl: 'https://securepay.tinkoff.ru/v2/',
  userAgent: 'Tinkoff Payment Node.js SDK (https://slava.fomin.io)',
};


/**
 * A generic API client that encapsulates all communications
 * with Tinkoff Payment API using the provided low-level HTTP client.
 */
export class ApiClient {

  private readonly options: ApiClientOptions;


  constructor(options: ApiClientOptions) {
    this.options = Object.assign({}, defaultOptions, options);
  }


  public async sendRequest<ResponsePayloadType extends ResponsePayload>(options: {
    request: HttpRequest;
    requestSchema: Schema;
    responseSchema: Schema;

  }): Promise<HttpResponse<ResponsePayloadType>> {

    const { httpClient } = this.options;

    const {
      request,
      requestSchema,
      responseSchema,

    } = options;

    this.applyBaseUrl(request);

    this.serializeRequest(request, requestSchema);

    this.addTerminalKey(request);

    this.addSignatureToken(request);

    this.handleHeaders(request);

    // Using low-level transport to send the request
    const response = await httpClient.sendRequest<ResponsePayloadType>(request);

    this.deserializeResponse(response, responseSchema);

    const { payload } = response;

    // Throwing error in case if request failed
    if (payload.ErrorCode !== '0') {
      throw new SdkError({ payload });
    }

    return response;

  }


  private applyBaseUrl(request: HttpRequest) {
    const { baseUrl } = this.options;
    request.url = (new URL(request.url, baseUrl)).toString();
  }

  private serializeRequest(request: HttpRequest, schema: Schema) {
    request.payload = serializeData({
      data: request.payload,
      schema,
    });
  }

  private deserializeResponse(response: HttpResponse, schema: Schema) {
    response.payload = serializeData({
      data: response.payload,
      schema,
      ignoreMissing: true,
    });
  }

  private addSignatureToken(request: HttpRequest) {

    const { password } = this.options;

    request.payload = signRequestPayload({
      payload: request.payload,
      password,
    });

  }

  private addTerminalKey(request: HttpRequest) {

    const { terminalKey } = this.options;

    Object.assign(request.payload, {
      TerminalKey: terminalKey,
    });

  }

  private handleHeaders(request: HttpRequest) {

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

}
