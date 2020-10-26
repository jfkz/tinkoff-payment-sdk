/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */

import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface AddCustomerRequestPayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
  /** IP-адрес запроса */
  IP?: string;
  /** Email клиента */
  Email?: string;
  /** Телефон клиента (+71234567890) */
  Phone?: string;
}


const addCustomerRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export interface AddCustomerResponsePayload extends BaseResponsePayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
}


const addCustomerResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function addCustomer(options: {
  apiClient: BaseClient;
  payload: AddCustomerRequestPayload;

}): Promise<AddCustomerResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<AddCustomerResponsePayload>({
    request: {
      url: 'AddCustomer',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: addCustomerRequestSchema,
    responseSchema: addCustomerResponseSchema,
  });

  return response.payload;

}
