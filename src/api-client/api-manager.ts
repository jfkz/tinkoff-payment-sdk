
import { ApiClient, ApiClientOptions } from './api-client';
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

}
