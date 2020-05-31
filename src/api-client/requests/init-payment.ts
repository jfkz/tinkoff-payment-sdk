
import { ApiClient } from '../api-client';
import { HttpRequestMethod } from '../../http-client/http-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { Language } from './common/language';
import { PaymentStatus } from '../../common/payment-status';


//=========//
// REQUEST //
//=========//

export interface InitPaymentOneOffRequestPayload {
  OrderId: string;
  Amount?: number;
  IP?: string;
  Description?: string;
  Token?: string;
  Language?: Language;
  RedirectDueDate?: Date;
  NotificationURL?: string;
  SuccessURL?: string;
  FailURL?: string;
  DATA?: Record<string, string>;
}

export interface InitPaymentRecurrentRequestPayload extends InitPaymentOneOffRequestPayload {
  Recurrent: 'Y';
  CustomerKey: string;
}

export type InitPaymentRequestPayload = (
  | InitPaymentOneOffRequestPayload
  | InitPaymentRecurrentRequestPayload
);

const initPaymentRequestSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyToPenny,
    optional: true,
  },
  {
    property: 'RedirectDueDate',
    type: PropType.DateToString,
    optional: true,
  },
];


//==========//
// RESPONSE //
//==========//

export interface InitPaymentResponsePayload extends BaseResponsePayload {
  TerminalKey: string;
  Amount: number;
  OrderId: string;
  Success: boolean;
  Status: PaymentStatus;
  PaymentId: number;
  PaymentURL?: string;
}


const initPaymentResponseSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyFromPenny,
  },
];


//==========//
// FUNCTION //
//==========//

export async function initPayment(options: {
  apiClient: ApiClient;
  payload: InitPaymentRequestPayload;

}): Promise<InitPaymentResponsePayload> {

  const { apiClient, payload } = options;

  const response = await apiClient.sendRequest<InitPaymentResponsePayload>({
    request: {
      url: '/Init',
      method: HttpRequestMethod.POST,
      payload,
    },
    requestSchema: initPaymentRequestSchema,
    responseSchema: initPaymentResponseSchema,
  });

  return response.payload;

}
