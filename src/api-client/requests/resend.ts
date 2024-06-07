import { NotificationTypes } from "./common/notification-types";
import { buildSendRequestFunction } from "./common/request";
import { ResponsePayload as BaseResponsePayload } from "../response-payload";

//=========//
// REQUEST //
//=========//

export interface ResendRequestPayload {
  /** Id платежа, по которому необходимо получить нотификацию из архива	*/
  PaymentId?: number;
  NotificationTypes?: NotificationTypes;
}

//==========//
// RESPONSE //
//==========//

export interface ResendResponsePayload extends BaseResponsePayload {
  Count: number;
}

//==========//
// FUNCTION //
//==========//

export const resend = buildSendRequestFunction<
  ResendRequestPayload,
  ResendResponsePayload
>("Resend", [], [], (payload) => {
  if (payload.PaymentId && !payload.NotificationTypes) {
    throw Error("NotificationTypes is required if PaymentId is supplied");
  }
  return {};
});
