import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { buildSendRequestFunction } from './common/request';

//=========//
// REQUEST //
//=========//

export interface ChargeQrRequestPayload {
  /** Уникальный идентификатор транзакции в системе Банка */
  PaymentId: number;
  /** Идентификатор привязки счета, назначаемый Банком Плательщика */
  AccountToken: string;
  /** IP-адрес клиента */
  IP?: string;
  /** true – если покупатель хочет получать уведомления на почту */
  SendEmail?: boolean;
  /** Адрес почты покупателя */
  InfoEmail?: string;
}


//==========//
// RESPONSE //
//==========//

export interface ChargeQrResponsePayload extends BaseResponsePayload {
  /** Номер заказа в системе Продавца	*/
  OrderId: string;
  //** Сумма списания в копейках */
  Amount: number;
  /** Код валюты ISO 421. */
  Currency: number;
  /** Уникальный идентификатор транзакции в системе Банка */
  PaymentId: number;
}


//==========//
// FUNCTION //
//==========//

export const chargeQr = buildSendRequestFunction<ChargeQrRequestPayload, ChargeQrResponsePayload>('ChargeQr');
