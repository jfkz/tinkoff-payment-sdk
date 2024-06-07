import { buildSendRequestFunction } from './common/request';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';

//=========//
// REQUEST //
//=========//

export interface CloseSpDealRequestPayload {
  /** Идентификатор сделки	*/
  SpAccumulationId: string;
}

//==========//
// RESPONSE //
//==========//

export type CloseSpDealResponsePayload = BaseResponsePayload;

//==========//
// FUNCTION //
//==========//

export const CloseSpDeal = buildSendRequestFunction<CloseSpDealRequestPayload, CloseSpDealResponsePayload>(
  'closeSpDeal',
);
