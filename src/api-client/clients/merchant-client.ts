
import { URL } from 'url';

import { SdkError } from '../../common/sdk-error';
import { signRequestPayload } from '../../common/signature';
import { HttpClient, HttpRequest, HttpResponse } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { serializeData } from '../../serialization/serializer';
import { ResponsePayload } from '../response-payload';
import { BaseClient } from './base-client';


export interface ApiClientOptions {
  httpClient: HttpClient;
  terminalKey: string;
  password: string;
  baseUrl?: string;
  userAgent?: string;
}


const merchantClientDefaultOptions: Partial<ApiClientOptions> = {
  baseUrl: 'https://securepay.tinkoff.ru/e2c/',
  userAgent: 'Tinkoff Payment Node.js SDK (https://github.com/jfkz/tinkoff-payment-sdk)',
};

/**
 * A generic API client that encapsulates all communications
 * with Tinkoff Payment API using the provided low-level HTTP client.
 * This version of client is using  
 */
export class MerchantClient extends BaseClient {

  constructor(options: ApiClientOptions) {
    super(options, merchantClientDefaultOptions);
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

    this.switchToForm(request);

    this.applyBaseUrl(request);

    this.serializeRequest(request, requestSchema);

    this.addTerminalKey(request);

    // this.addSignatureToken(request);

    this.addCryptoProSigns(request);

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

}
