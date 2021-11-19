import { TINKOFF_API_MERCHANT_URL } from '../../common/consts';
import { SdkError } from '../../common/sdk-error';
import { HttpRequest, HttpResponse } from '../../http-client/http-client';
import { SdkLogLevel } from '../../logger/logger';
import { Schema } from '../../serialization/schema';
import { SignProvider } from '../../sign-providers/sign-provider';
import { ResponsePayload } from '../response-payload';
import { ApiClientOptions, BaseClient } from './base-client';

const merchantClientDefaultOptions: Partial<ApiClientOptions> = {
  baseUrl: TINKOFF_API_MERCHANT_URL,
  userAgent: 'Tinkoff Payment Node.js SDK (https://github.com/jfkz/tinkoff-payment-sdk)',
};

/**
 * A generic API client that encapsulates all communications
 * with Tinkoff Payment API using the provided low-level HTTP client.
 */
export class MerchantClient extends BaseClient {
  
  private readonly signProvider: SignProvider;

  constructor(options: ApiClientOptions, signProvider: SignProvider) {
    const thisOptions = Object.assign({}, merchantClientDefaultOptions, (options || {}));
    super(options, thisOptions);
    this.signProvider = signProvider;
  }

  public async sendRequest<ResponsePayloadType extends ResponsePayload>(options: {
    request: HttpRequest;
    requestSchema: Schema;
    responseSchema: Schema;
    skipVerification?: boolean;

  }): Promise<HttpResponse<ResponsePayloadType>> {

    const { httpClient } = this.options;

    const {
      request,
      requestSchema,
      responseSchema,

    } = options;

    this.signProvider.setFormType(request);

    this.applyBaseUrl(request);

    this.serializeRequest(request, requestSchema);

    this.addTerminalKey(request);

    request.payload = this.signProvider.signRequestPayload(request.payload);

    this.handleHeaders(request);

    this.log(SdkLogLevel.debug, request);

    // Using low-level transport to send the request
    const response = await httpClient.sendRequest<ResponsePayloadType>(request);

    this.log(SdkLogLevel.debug, response);

    if (options.skipVerification) {
      return response;
    }

    if (typeof response.payload === 'string') {
      response.payload = JSON.parse(response.payload);
    }

    this.deserializeResponse(response, responseSchema);

    const { payload } = response;

    // Throwing error in case if request failed
    if (payload.ErrorCode !== '0') {
      throw new SdkError({ payload });
    }

    return response;

  }
}
