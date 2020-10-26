/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */

import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface RemoveCustomerRequestPayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
  /** IP-адрес запроса */
  IP?: string;
}


const removeCustomerRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export interface RemoveCustomerResponsePayload extends BaseResponsePayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
}


const removeCustomerResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function removeCustomer(options: {
  apiClient: BaseClient;
  payload: RemoveCustomerRequestPayload;

}): Promise<RemoveCustomerResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<RemoveCustomerResponsePayload>({
    request: {
      url: 'RemoveCustomer',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: removeCustomerRequestSchema,
    responseSchema: removeCustomerResponseSchema,
  });

  return response.payload;

}
