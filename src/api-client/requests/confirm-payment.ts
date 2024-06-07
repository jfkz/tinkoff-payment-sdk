import { validateAndPrepareReceipt } from './common/receipt';
import { Receipt } from './common/receipt';
import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { ApiClient } from '../clients/api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

/** @see https://oplata.tinkoff.ru/develop/api/payments/confirm-request/ */
export interface ConfirmPaymentRequestPayload {
  /** Идентификатор платежа в системе банка	*/
  PaymentId: number;
  /** Сумма в копейках */
  Amount?: number;
  /** IP-адрес покупателя	*/
  IP?: string;
  /** https://oplata.tinkoff.ru/develop/api/request-sign/ */
  Token?: string;
  /** Массив данных чека. См. https://oplata.tinkoff.ru/develop/api/payments/init-request/#Receipt */
  Receipt?: Receipt;
}

const ConfirmPaymentRequestSchema: Schema = [];

//==========//
// RESPONSE //
//==========//

/** https://oplata.tinkoff.ru/develop/api/autopayments/confirm-response/ */
export interface ConfirmPaymentResponsePayload extends BaseResponsePayload {
  /** Идентификатор заказа в системе продавца	*/
  OrderId: string;
  /** Сумма в копейках */
  Amount: number;
  /** Уникальный идентификатор транзакции в системе банка	*/
  PaymentId: number;
}

const ConfirmPaymentResponseSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyFromPenny,
  },
];

//==========//
// FUNCTION //
//==========//

export async function confirmPayment(options: {
  apiClient: ApiClient;
  payload: ConfirmPaymentRequestPayload;
}): Promise<ConfirmPaymentResponsePayload> {
  const { apiClient } = options;

  const { Receipt, ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  if (Receipt) {
    $payload.Receipt = validateAndPrepareReceipt(Receipt);
  }

  const response = await apiClient.sendRequest<ConfirmPaymentResponsePayload>({
    request: {
      url: 'Confirm',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: ConfirmPaymentRequestSchema,
    responseSchema: ConfirmPaymentResponseSchema,
  });

  return response.payload;
}
