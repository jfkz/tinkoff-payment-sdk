import { validateAndPrepareReceipt } from "./common/receipt";
import { Receipt } from "./common/receipt";
import { buildSendRequestFunction } from "./common/request";
import { ResponsePayload as BaseResponsePayload } from "../response-payload";

//=========//
// REQUEST //
//=========//

export interface SendClosingReceiptRequestPayload {
  PaymentId: number;
  Receipt: Receipt;
}

//==========//
// RESPONSE //
//==========//

export interface SendClosingReceiptResponsePayload extends BaseResponsePayload {
  /** Успешность операции (true/false) */
  Success: boolean;
  /** Код ошибки, «0» - если успешно */
  ErrorCode: string;
  /** Краткое описание ошибки	*/
  Message?: string;
}

//==========//
// FUNCTION //
//==========//

export const sendClosingReceipt = buildSendRequestFunction<
  SendClosingReceiptRequestPayload,
  SendClosingReceiptResponsePayload
>("sendClosingReceipt", [], [], (payload) => ({
  Receipt: validateAndPrepareReceipt(payload.Receipt),
}));
