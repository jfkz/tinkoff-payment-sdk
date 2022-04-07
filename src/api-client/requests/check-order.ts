import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { Payments } from './common/payments';
import { buildSendRequestFunction } from './common/request';

//=========//
// REQUEST //
//=========//

export interface CheckOrderRequestPayload {
  /** Номер заказа в системе Продавца	*/
  OrderId: number | string;
}


//==========//
// RESPONSE //
//==========//

export interface CheckOrderResponsePayload extends BaseResponsePayload {
  /** Уникальный номер заказа в системе Продавца	*/
  OrderId: string;
  /** Детали */
  Payments: Payments;
}


//==========//
// FUNCTION //
//==========//

export const checkOrder = buildSendRequestFunction<CheckOrderRequestPayload, CheckOrderResponsePayload>('CheckOrder');
