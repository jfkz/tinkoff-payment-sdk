import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { buildSendRequestFunction } from './common/request';
import { DataTypeQr } from './common/data-type-qr';

//=========//
// REQUEST //
//=========//

export interface GetQrRequestPayload {
  /** PaymentId покупателя в системе Продавца	*/
  PaymentId: number;
  /** Тип возвращаемых данных: PAYLOAD IMAGE */
  DataType?: DataTypeQr;
}


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


//==========//
// FUNCTION //
//==========//

export const getQr = buildSendRequestFunction<GetQrRequestPayload, GetQrResponsePayload>('GetQr');
