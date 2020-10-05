
import { PaymentStatus } from '../../common/payment-status';
import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { ApiClient } from '../api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { validateAndPrepareReceipt } from './common/receipt';
import { Receipt } from './common/receipt';


//=========//
// REQUEST //
//=========//

/** @see https://oplata.tinkoff.ru/develop/api/payments/cancel-request/ */
export interface CancelPaymentRequestPayload {
  /** Идентификатор платежа в системе банка	*/
  PaymentId: number;
  /** В статусах NEW и AUTHORIZED возможен только полный возврат, поэтому параметр игнорируется	*/
  Amount?: number;
  IP?: string;
  Token?: string;
  /** В чеке указываются данные товаров, подлежащих возврату */
  Receipt?: Receipt;
}


const cancelPaymentRequestSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyToPenny,
    optional: true,
  },
];


//==========//
// RESPONSE //
//==========//

export interface CancelPaymentResponsePayload extends BaseResponsePayload {
  TerminalKey: string;
  OrderId: string;
  Success: boolean;
  Status: PaymentStatus;
  PaymentId: number;
  /** Код ошибки Если ошибки не произошло, передайте значение «0»	 */
  ErrorCode: string;
  /** Краткое описание ошибки	*/
  Message: string;
  /** Подробное описание ошибки	*/
  Details: string;
  /** Сумма до возврата в копейках */
  OriginalAmount: number;
  /** Сумма после возврата в копейках	*/
  NewAmount: number;
}


const cancelPaymentResponseSchema: Schema = [
  {
    property: 'OriginalAmount',
    type: PropType.MoneyFromPenny,
  },
  {
    property: 'NewAmount',
    type: PropType.MoneyFromPenny,
  },
];


//==========//
// FUNCTION //
//==========//

export async function cancelPayment(options: {
  apiClient: ApiClient;
  payload: CancelPaymentRequestPayload;

}): Promise<CancelPaymentResponsePayload> {

  const { apiClient } = options;

  const { Receipt, ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  if (Receipt) {
    $payload.Receipt = validateAndPrepareReceipt(Receipt);
  }

  const response = await apiClient.sendRequest<CancelPaymentResponsePayload>({
    request: {
      url: 'Cancel',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: cancelPaymentRequestSchema,
    responseSchema: cancelPaymentResponseSchema,
  });

  return response.payload;

}
