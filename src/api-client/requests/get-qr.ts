import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface GetQrRequestPayload {
  /** PaymentId покупателя в системе Продавца	*/
  PaymentId: number;
  /** Тип возвращаемых данных: PAYLOAD IMAGE */
  DataType?: 'PAYLOAD' | 'IMAGE';
}


const getQrRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export interface GetQrResponsePayload extends BaseResponsePayload {
  /** Уникальный номер заказа в системе Продавца	*/
  OrderId: string;
  //** В зависимости от параметра DataType в запросе */
  Data: string;
  /** Уникальный идентификатор транзакции в системе Банка */
  PaymentId: number;
}


const getQrResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function getQr(options: {
  apiClient: BaseClient;
  payload: GetQrRequestPayload;

}): Promise<GetQrResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<GetQrResponsePayload>({
    request: {
      url: 'GetQr',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: getQrRequestSchema,
    responseSchema: getQrResponseSchema,
  });

  return response.payload;

}
