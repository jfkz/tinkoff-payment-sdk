import { SignProvider } from '../sign-providers/sign-provider';
import { ApiClient } from './clients/api-client';
import { ApiClientOptions, BaseClient } from './clients/base-client';
import { MerchantClient } from './clients/merchant-client';
import {
  addCard,
  AddCardRequestPayload,
  AddCardResponsePayload
} from './requests/add-card';
import { addCustomer, AddCustomerRequestPayload, AddCustomerResponsePayload } from './requests/add-customer';
import {
  cancelPayment,
  CancelPaymentRequestPayload,
  CancelPaymentResponsePayload,
} from './requests/cancel-payment';
import { chargePayment, ChargePaymentRequestPayload, ChargePaymentResponsePayload } from './requests/charge-payment';
import { confirmPayment, ConfirmPaymentRequestPayload, ConfirmPaymentResponsePayload } from './requests/confirm-payment';
import { getCardList, GetCardListRequestPayload, GetCardListResponsePayload } from './requests/get-card-list';
import { getCustomer, GetCustomerRequestPayload, GetCustomerResponsePayload } from './requests/get-customer';
import { getState, GetStateRequestPayload, GetStateResponsePayload } from './requests/get-state';
import { getQr, GetQrRequestPayload, GetQrResponsePayload } from './requests/get-qr';
import { checkOrder, CheckOrderRequestPayload, CheckOrderResponsePayload } from './requests/check-order';
import {
  initPayment,
  InitPaymentRequestPayload,
  InitPaymentResponsePayload,
} from './requests/init-payment';
import { payment, PaymentRequestPayload, PaymentResponsePayload } from './requests/payment';
import { removeCard, RemoveCardRequestPayload, RemoveCardResponsePayload } from './requests/remove-card';
import { removeCustomer, RemoveCustomerRequestPayload, RemoveCustomerResponsePayload } from './requests/remove-customer';


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

  public getState(
    payload: GetStateRequestPayload,

  ): Promise<GetStateResponsePayload> {

    return getState({
      apiClient: this.apiClient,
      payload,
    });

  }

  public getQr(
    payload: GetQrRequestPayload,

  ): Promise<GetQrResponsePayload> {

    return getQr({
      apiClient: this.apiClient,
      payload,
    });

  }

  public checkOrder(
    payload: CheckOrderRequestPayload,

  ): Promise<CheckOrderResponsePayload> {

    return checkOrder({
      apiClient: this.apiClient,
      payload,
    });

  }

}

export class ApiManagerMerchant extends BaseApiManager {

  constructor (options: ApiClientOptions, signProvider: SignProvider) {
    super();
    this.apiClient = new MerchantClient(options, signProvider);
  }

  public addCustomer(
    payload: AddCustomerRequestPayload

  ): Promise<AddCustomerResponsePayload> {

    return addCustomer({
      apiClient: this.apiClient,
      payload,
    });

  }

  public getCustomer(
    payload: GetCustomerRequestPayload

  ): Promise<GetCustomerResponsePayload> {

    return getCustomer({
      apiClient: this.apiClient,
      payload,
    });

  }


  public removeCustomer(
    payload: RemoveCustomerRequestPayload

  ): Promise<RemoveCustomerResponsePayload> {

    return removeCustomer({
      apiClient: this.apiClient,
      payload,
    });

  }


  public addCard(
    payload: AddCardRequestPayload

  ): Promise<AddCardResponsePayload> {

    return addCard({
      apiClient: this.apiClient,
      payload,
    });

  }

  public getCardList(
    payload: GetCardListRequestPayload

  ): Promise<GetCardListResponsePayload> {

    return getCardList({
      apiClient: this.apiClient,
      payload,
    });

  }

  public removeCard(
    payload: RemoveCardRequestPayload

  ): Promise<RemoveCardResponsePayload> {

    return removeCard({
      apiClient: this.apiClient,
      payload,
    });

  }

  public initPayment(
    payload: InitPaymentRequestPayload

  ): Promise<InitPaymentResponsePayload> {

    return initPayment({
      apiClient: this.apiClient,
      payload,
    });

  }

  public payment(
    payload: PaymentRequestPayload
  ): Promise<PaymentResponsePayload> {

    return payment({
      apiClient: this.apiClient,
      payload,
    });
  }

  public getState(
    payload: GetStateRequestPayload
  ): Promise<GetStateResponsePayload> {

    return getState({
      apiClient: this.apiClient,
      payload,
    });
  }
}
