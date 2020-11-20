import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { ApiClient } from '../clients/api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';


//=========//
// REQUEST //
//=========//

/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */
export interface PaymentRequestPayload {
  /** Идентификатор платежа в системе банка	*/
  PaymentId: number;
}

const PaymentRequestSchema: Schema = [];

//==========//
// RESPONSE //
//==========//

/** http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */
export interface PaymentResponsePayload extends BaseResponsePayload {
  /** Идентификатор заказа в системе продавца	*/
  OrderId: string;
  /** Уникальный идентификатор транзакции в системе банка	*/
  PaymentId: number;
}

const PaymentResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function payment(options: {
  apiClient: ApiClient;
  payload: PaymentRequestPayload;

}): Promise<PaymentResponsePayload> {

  const { apiClient } = options;

  const $payload: any = {
    ...options.payload
  };

  const response = await apiClient.sendRequest<PaymentResponsePayload>({
    request: {
      url: 'Payment',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: PaymentRequestSchema,
    responseSchema: PaymentResponseSchema,
  });

  return response.payload;

}
