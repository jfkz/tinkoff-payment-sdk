import { PaymentStatus } from '../../common/payment-status';
import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { ApiClient } from '../clients/api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { Language } from './common/language';
import { PayType } from './common/pay-type';
import { validateAndPrepareReceipt } from './common/receipt';
import { Receipt } from './common/receipt';


//=========//
// REQUEST //
//=========//

/** @see https://oplata.tinkoff.ru/develop/api/payments/init-request/ */
export interface InitPaymentRequestPayload {
  OrderId: string;
  Amount?: number;
  /** Используется только в /e2c/Init */
  CardId?: number;
  IP?: string;
  Description?: string;
  Token?: string;
  Language?: Language;
  Recurrent?: 'Y';
  /** Идентификатор покупателя в системе Продавца */
  CustomerKey?: string;
  RedirectDueDate?: Date;
  NotificationURL?: string;
  SuccessURL?: string;
  FailURL?: string;
  PayType?: PayType;
  Receipt?: Receipt;
  DATA?: Record<string, string>;
}


const initPaymentRequestSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyToPenny,
    optional: true,
  },
  {
    property: 'RedirectDueDate',
    type: PropType.DateToString,
    optional: true,
  },
];


//==========//
// RESPONSE //
//==========//

export interface InitPaymentResponsePayload extends BaseResponsePayload {
  Amount: number;
  OrderId: string;
  PaymentId: number;
  CardId?: number;
  /** Card pan */
  Pan?: string;
  /** Card expiration date */
  ExpDate?: string;
  /** For recurrent payments */
  RebillId?: number;
  PaymentURL?: string;
}


const initPaymentResponseSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyFromPenny,
  },
  {
    property: 'ExpDate',
    type: PropType.ExpDateFromString,
  }
];


//==========//
// FUNCTION //
//==========//

export async function initPayment(options: {
  apiClient: ApiClient;
  payload: InitPaymentRequestPayload;

}): Promise<InitPaymentResponsePayload> {

  const { apiClient } = options;

  const { Receipt, ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  if (Receipt) {
    $payload.Receipt = validateAndPrepareReceipt(Receipt);
  }

  const response = await apiClient.sendRequest<InitPaymentResponsePayload>({
    request: {
      url: 'Init',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: initPaymentRequestSchema,
    responseSchema: initPaymentResponseSchema,
  });

  return response.payload;

}
