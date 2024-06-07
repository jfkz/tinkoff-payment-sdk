import { buildSendRequestFunction } from './common/request';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

export interface Member {
  //** Идентификатор участника */
  MemberId: string;
  //** Наименование участника */
  MemberName: string;
  //** true - если данный участник был получателем указанного платежа, false - в противном случае */
  IsPayee: boolean;
}

//=========//
// REQUEST //
//=========//

export interface QrMembersListRequestPayload {
  /** Уникальный идентификатор транзакции в системе Банка */
  PaymentId: number;
}

//==========//
// RESPONSE //
//==========//

export interface QrMembersListResponsePayload extends BaseResponsePayload {
  //** Номер заказа в системе Продавца */
  OrderId: string;
  //** */
  Members?: Member[];
}

//==========//
// FUNCTION //
//==========//

export const getQrMembersList = buildSendRequestFunction<QrMembersListRequestPayload, QrMembersListResponsePayload>(
  'QrMembersList',
);
