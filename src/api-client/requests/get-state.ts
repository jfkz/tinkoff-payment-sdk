/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */

import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface GetStateRequestPayload {
  /** PaymentId покупателя в системе Продавца	*/
  PaymentId: string;
  /** IP-адрес запроса */
  IP?: string;
}


const getStateRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export interface GetStateResponsePayload extends BaseResponsePayload {
  /** Уникальный номер заказа в системе Продавца	*/
  OrderId: string;
  /** Сумма отмены в копейках. */
  Amount?: number;
}


const getStateResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function getState(options: {
  apiClient: BaseClient;
  payload: GetStateRequestPayload;

}): Promise<GetStateResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<GetStateResponsePayload>({
    request: {
      url: 'GetState',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: getStateRequestSchema,
    responseSchema: getStateResponseSchema,
  });

  return response.payload;

}
