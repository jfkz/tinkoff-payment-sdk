/** @see http://static2.tinkoff.ru/acquiring/manuals/merchant_api_protocoI_e2c.pdf */

import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema } from '../../serialization/schema';
import { BaseClient } from '../clients/base-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';


export enum ECardStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
  EXPIRED = 'E',
  DELETED = 'D',
}

export enum ECardType {
  CREDIT = 0,
  DEBET = 1,
  CREDITDEBIT = 2,
}

export interface ICardInfo {
  /** Номер карты 411111******1111 */
  Pan: string;
  /** Идентификатор карты в системе Банка */
  CardId: number;
  /** Статус карты: A – активная, I – не активная, E – срок действия карты истек, D - удаленная */
  Status: ECardStatus;
  /** Идентификатор рекуррентного платежа */
  RebillId: number;
  /** Тип карты:
 0 - карта списания;
 1 - карта пополнения;
 2 - карта пополнения и списания
 */
  CardType: ECardType;
  /** Срок действия карты */
  ExpDate?: string;
}

//=========//
// REQUEST //
//=========//

export interface GetCardListRequestPayload {
  /** Идентификатор покупателя в системе Продавца	*/
  CustomerKey: string;
  /** IP-адрес запроса */
  IP?: string;
}


const getCardListRequestSchema: Schema = [];


//==========//
// RESPONSE //
//==========//

export type GetCardListResponsePayload = BaseResponsePayload & ICardInfo[]

/** TODO: Add verification to ICardInfo */
const getCardListResponseSchema: Schema = [];


//==========//
// FUNCTION //
//==========//

export async function getCardList(options: {
  apiClient: BaseClient;
  payload: GetCardListRequestPayload;

}): Promise<GetCardListResponsePayload> {

  const { apiClient } = options;

  const { ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  const response = await apiClient.sendRequest<GetCardListResponsePayload>({
    request: {
      url: 'GetCardList',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: getCardListRequestSchema,
    responseSchema: getCardListResponseSchema,
    skipVerification: true,
  });

  if (typeof response.payload === 'string') {
    response.payload = JSON.parse(response.payload);
  }

  return response.payload;

}
