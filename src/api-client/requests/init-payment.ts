
import { PaymentStatus } from '../../common/payment-status';
import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { moneyToPennyOrThrow } from '../../serialization/serializers/money';
import { ApiClient } from '../api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { Language } from './common/language';
import { PayType } from './common/pay-type';
import { Receipt, ReceiptItem } from './common/receipt';


//=========//
// REQUEST //
//=========//

/** @see https://oplata.tinkoff.ru/develop/api/payments/init-request/ */
export interface InitPaymentRequestPayload {
  OrderId: string;
  Amount?: number;
  IP?: string;
  Description?: string;
  Token?: string;
  Language?: Language;
  Recurrent?: 'Y';
  CustomerKey?: string;
  RedirectDueDate?: Date;
  NotificationURL?: string;
  SuccessURL?: string;
  FailURL?: string;
  PayType?: PayType;
  Receipt?: Receipt;
  DATA?: Record<string, string>;
}


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

  const { apiClient } = options;

  const { Receipt, ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  if (Receipt) {
    $payload.Receipt = validateAndPrepareReceipt(Receipt);
  }

  const response = await apiClient.sendRequest<InitPaymentResponsePayload>({
    request: {
      url: 'Init',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: initPaymentRequestSchema,
    responseSchema: initPaymentResponseSchema,
  });

  return response.payload;

}


//===========//
// UTILITIES //
//===========//

function validateAndPrepareReceipt(receipt: Receipt): Receipt {

  if (!receipt.Items) {
    throw new Error('Receipt.Items must be set when receipt is used');
  }

  if (receipt.Items.length === 0) {
    throw new Error('Receipt.Items must contain at least one item');
  }

  return {
    ...receipt,
    Items: [...receipt.Items.map(validateAndPrepareReceiptItem)]
  };

}

function validateAndPrepareReceiptItem(item: ReceiptItem): ReceiptItem {

  const $item = { ...item };


  //-------//
  // PRICE //
  //-------//

  if (!$item.Price) {
    throw new Error('Price must be set for receipt item');
  }

  $item.Price = moneyToPennyOrThrow($item.Price);


  //----------//
  // QUANTITY //
  //----------//

  if ($item.Quantity <= 0) {
    throw new Error('Receipt item quantity must be greater than zero');
  }


  //--------//
  // AMOUNT //
  //--------//

  // Calculating amount automatically, if not defined
  if ($item.Amount === undefined) {
    $item.Amount = ($item.Price * $item.Quantity);
  }


  // -----

  return $item;

}
