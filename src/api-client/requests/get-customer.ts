/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */

import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface GetCustomerRequestPayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
  /** IP-адрес запроса */
  IP?: string;
}


const getCustomerRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export interface GetCustomerResponsePayload extends BaseResponsePayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
}


const getCustomerResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function getCustomer(options: {
  apiClient: BaseClient;
  payload: GetCustomerRequestPayload;

}): Promise<GetCustomerResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<GetCustomerResponsePayload>({
    request: {
      url: 'GetCustomer',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: getCustomerRequestSchema,
    responseSchema: getCustomerResponseSchema,
  });

  return response.payload;

}
