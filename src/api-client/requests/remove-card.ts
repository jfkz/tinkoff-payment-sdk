/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */

import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface RemoveCardRequestPayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
  /** Идентификатор карты в системе Банка */
  CardId: number;
  /** IP-адрес запроса */
  IP?: string;
}


const removeCardRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export interface RemoveCardResponsePayload extends BaseResponsePayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
}


const removeCardResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function removeCard(options: {
  apiClient: BaseClient;
  payload: RemoveCardRequestPayload;

}): Promise<RemoveCardResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<RemoveCardResponsePayload>({
    request: {
      url: 'RemoveCard',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: removeCardRequestSchema,
    responseSchema: removeCardResponseSchema,
  });

  return response.payload;

}
