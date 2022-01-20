import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { ApiClient } from '../clients/api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

/** @see https://oplata.tinkoff.ru/develop/api/payments/charge-request/ */
export interface ChargePaymentRequestPayload {
  /** Идентификатор платежа в системе банка	*/
  PaymentId: number;
  /** Идентификатор автоплатежа	*/
  RebillId: number;
  /** Получение покупателем уведомлений на электронную почту */
  SendEmail?: boolean;
  /** Электронная почта покупателя */
  InfoEmail?: string;
  /** IP-адрес покупателя	*/
  IP?: string;
  /** https://oplata.tinkoff.ru/develop/api/request-sign/ */
  Token?: string;
}

const ChargePaymentRequestSchema: Schema = [];

//==========//
// RESPONSE //
//==========//

/** https://oplata.tinkoff.ru/develop/api/autopayments/charge-response/ */
export interface ChargePaymentResponsePayload extends BaseResponsePayload {
  /** Сумма в копейках */
  Amount: number;
  /** Идентификатор заказа в системе продавца	*/
  OrderId: string;
  /** Уникальный идентификатор транзакции в системе банка	*/
  PaymentId: number;
  /** Идентификатор для безопасной сделки */
  SpAccumulationId?: string;
}

const ChargePaymentResponseSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyFromPenny,
  },
];


//==========//
// FUNCTION //
//==========//

export async function chargePayment(options: {
  apiClient: ApiClient;
  payload: ChargePaymentRequestPayload;

}): Promise<ChargePaymentResponsePayload> {

  const { apiClient } = options;

  const {...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<ChargePaymentResponsePayload>({
    request: {
      url: 'Charge',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: ChargePaymentRequestSchema,
    responseSchema: ChargePaymentResponseSchema,
  });

  return response.payload;

}
