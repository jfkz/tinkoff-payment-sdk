
import { ApiClient, ApiClientOptions } from './clients/api-client';
import { BaseClient } from './clients/base-client';
import { MerchantClient } from './clients/merchant-client';
import { addCard, AddCardRequestPayload, AddCardResponsePayload } from './requests/add-card';
import {
  cancelPayment,
  CancelPaymentRequestPayload,
  CancelPaymentResponsePayload,
} from './requests/cancel-payment';
import { chargePayment, ChargePaymentRequestPayload, ChargePaymentResponsePayload } from './requests/charge-payment';
import { confirmPayment, ConfirmPaymentRequestPayload, ConfirmPaymentResponsePayload } from './requests/confirm-payment';
import {
  initPayment,
  InitPaymentRequestPayload,
  InitPaymentResponsePayload,
} from './requests/init-payment';


abstract class BaseApiManager {
  protected apiClient!: BaseClient;

}

/**
 * Just a wrapper around `ApiClient` and all the request functions to
 * simplify the SDK usage.
 */
export class ApiManager extends BaseApiManager {

  constructor(options: ApiClientOptions) {
    super();
    this.apiClient = new ApiClient(options);
  }

  public initPayment(
    payload: InitPaymentRequestPayload

  ): Promise<InitPaymentResponsePayload> {

    return initPayment({
      apiClient: this.apiClient,
      payload,
    });

  }

  public cancelPayment(
    payload: CancelPaymentRequestPayload

  ): Promise<CancelPaymentResponsePayload> {

    return cancelPayment({
      apiClient: this.apiClient,
      payload,
    });

  }


  public confirmPayment(
    payload: ConfirmPaymentRequestPayload

  ): Promise<ConfirmPaymentResponsePayload> {

    return confirmPayment({
      apiClient: this.apiClient,
      payload,
    });

  }


  public chargePayment(
    payload: ChargePaymentRequestPayload

  ): Promise<ChargePaymentResponsePayload> {

    return chargePayment({
      apiClient: this.apiClient,
      payload,
    });

  }

}

export class ApiManagerMerchant extends BaseApiManager {

  constructor (options: ApiClientOptions) {
    super();
    if (!options.baseUrl) {
      options.baseUrl = 'https://securepay.tinkoff.ru/e2c/';
    }

    this.apiClient = new MerchantClient(options);
  }

  public addCard(
    payload: AddCardRequestPayload

  ): Promise<AddCardResponsePayload> {

    return addCard({
      apiClient: this.apiClient,
      payload,
    });

  }
}
