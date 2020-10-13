
import { ApiClient, ApiClientOptions } from './api-client';
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



/**
 * Just a wrapper around `ApiClient` and all the request functions to
 * simplify the SDK usage.
 */
export class ApiManager {

  private apiClient: ApiClient;


  constructor(options: ApiClientOptions) {
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
