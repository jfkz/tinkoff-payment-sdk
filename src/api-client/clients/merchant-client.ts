
import { SdkError } from '../../common/sdk-error';
import { HttpRequest, HttpResponse } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { CryptoProSignProvider, CryptoProSignProviderOptions } from '../../sign-providers/cryptopro-sign-provider';
import { ResponsePayload } from '../response-payload';
import { ApiClientOptions, BaseClient } from './base-client';

export interface MerchantClientOptions extends ApiClientOptions, CryptoProSignProviderOptions {

}

const merchantClientDefaultOptions: Partial<MerchantClientOptions> = {
  baseUrl: 'https://securepay.tinkoff.ru/e2c/',
  userAgent: 'Tinkoff Payment Node.js SDK (https://github.com/jfkz/tinkoff-payment-sdk)',
};

/**
 * A generic API client that encapsulates all communications
 * with Tinkoff Payment API using the provided low-level HTTP client.
 */
export class MerchantClient extends BaseClient {
  
  private cryptoProOptions: CryptoProSignProviderOptions;

  constructor(options: MerchantClientOptions) {
    super(options, merchantClientDefaultOptions);
    this.cryptoProOptions = options;
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

    this.switchToForm(request);

    this.applyBaseUrl(request);

    this.serializeRequest(request, requestSchema);

    this.addTerminalKey(request);

    this.addCryptoProSigns(request);

    this.handleHeaders(request);

    // Using low-level transport to send the request
    const response = await httpClient.sendRequest<ResponsePayloadType>(request);

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

  /** @deprecated This function will be refactored to new bridge-like style */
  protected addCryptoProSigns(request: HttpRequest): void {

    const cryptoPro = new CryptoProSignProvider(this.cryptoProOptions);

    const DigestValue = cryptoPro.digest(request.payload);

    const SignatureValue = cryptoPro.sign(DigestValue);

    request.payload = {
      ...request.payload,
      DigestValue,
      SignatureValue,
      X509SerialNumber: 1,
    };
  }

}
