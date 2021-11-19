
import { SdkError } from '../../common/sdk-error';
import { HttpRequest, HttpResponse } from '../../http-client/http-client';
import { SdkLogLevel } from '../../logger/logger';
import { Schema } from '../../serialization/schema';
import { ResponsePayload } from '../response-payload';
import { ApiClientOptions, BaseClient } from './base-client';


const apiClientDefaultOptions: Partial<ApiClientOptions> = {
  baseUrl: 'https://securepay.tinkoff.ru/v2/',
  userAgent: 'Tinkoff Payment Node.js SDK (https://github.com/jfkz/tinkoff-payment-sdk)',
};


/**
 * A generic API client that encapsulates all communications
 * with Tinkoff Payment API using the provided low-level HTTP client.
 */
export class ApiClient extends BaseClient {

  constructor(options: ApiClientOptions) {
    super(options, apiClientDefaultOptions);
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

    this.log(SdkLogLevel.debug, request);

    // Using low-level transport to send the request
    const response = await httpClient.sendRequest<ResponsePayloadType>(request);

    this.log(SdkLogLevel.debug, response);

    this.deserializeResponse(response, responseSchema);

    const { payload } = response;

    // Throwing error in case if request failed
    if (payload.ErrorCode !== '0') {
      throw new SdkError({ payload });
    }

    return response;

  }
}
