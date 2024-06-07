//=============//
// HTTP CLIENT //
//=============//

export {
  type HttpClient,
  type HttpRequest,
  type HttpResponse,
  HttpRequestMethod,
} from "./http-client/http-client";

export {
  GotHttpClient,
  type GotHttpClientOptions,
} from "./http-client/got-http-client";

export {
  RequestHttpClient,
  type RequestHttpClientOptions,
} from "./http-client/request-http-client";

//============//
// API CLIENT //
//============//

export { ApiClient } from "./api-client/clients/api-client";

export { Language } from "./api-client/requests/common/language";
export { PayType } from "./api-client/requests/common/pay-type";
export { DataTypeQr } from "./api-client/requests/common/data-type-qr";

export {
  type AgentData,
  AgentDataAgentSign,
  type Receipt,
  type ReceiptItem,
  ReceiptPaymentMethod,
  ReceiptPaymentObject,
  ReceiptTax,
  ReceiptTaxation,
  type SupplierInfo,
} from "./api-client/requests/common/receipt";

//================//
// SIGN PROVIDERS //
//================//

export { CryptoProSignProvider } from "./sign-providers/cryptopro-sign-provider";
export { RSASignProvider } from "./sign-providers/rsa-sign-provider";

//=============//
// API MANAGER //
//=============//

export {
  ApiManager,
  ApiManagerMerchant,
  ApiManagerSafeDeal,
} from "./api-client/api-manager";

//=================//
// WEBHOOK HANDLER //
//=================//

export {
  WebhookHandler,
  type WebhookHandlerOptions,
} from "./webhook-handler/webhook-handler";
export { type WebhookPayload } from "./webhook-handler/webhook-payload";

//==============//
// COMMON TYPES //
//==============//

export { PaymentStatus } from "./common/payment-status";
export { SdkError, type PayloadWithMessage } from "./common/sdk-error";

//=======================//
// REQUEST: INIT PAYMENT //
//=======================//

export { type ResponsePayload as BaseResponsePayload } from "./api-client/response-payload";

export {
  initPayment,
  type InitPaymentRequestPayload,
  type InitPaymentResponsePayload,
  type ITinkoffInitRequestData,
} from "./api-client/requests/init-payment";

//=========================//
// REQUEST: GET QR //
//=========================//

export {
  getQr,
  type GetQrRequestPayload,
  type GetQrResponsePayload,
} from "./api-client/requests/get-qr";

//=========================//
// REQUEST: CHECK ORDER //
//=========================//

export {
  checkOrder,
  type CheckOrderRequestPayload,
  type CheckOrderResponsePayload,
} from "./api-client/requests/check-order";

//===============================//
// REQUEST: SEND CLOSING RECEIPT //
//===============================//

export {
  sendClosingReceipt,
  type SendClosingReceiptRequestPayload,
  type SendClosingReceiptResponsePayload,
} from "./api-client/requests/send-closing-receipt";

//=========================//
// REQUEST: CANCEL PAYMENT //
//=========================//

export {
  cancelPayment,
  type CancelPaymentRequestPayload,
  type CancelPaymentResponsePayload,
} from "./api-client/requests/cancel-payment";

//==========================//
// REQUEST: CONFIRM PAYMENT //
//==========================//

export {
  confirmPayment,
  type ConfirmPaymentRequestPayload,
  type ConfirmPaymentResponsePayload,
} from "./api-client/requests/confirm-payment";

//==========================//
// REQUEST: CHARGE PAYMENT  //
//==========================//

export {
  chargePayment,
  type ChargePaymentRequestPayload,
  type ChargePaymentResponsePayload,
} from "./api-client/requests/charge-payment";

//===========================//
// REQUEST: FinishAuthorize  //
//===========================//

export {
  finishAuthorize,
  type FinishAuthorizeRequestPayload,
  type FinishAuthorizeResponsePayload,
} from "./api-client/requests/finish-authorize";

// Merchant API

export * from "./api-client/requests/add-customer";
export * from "./api-client/requests/get-customer";
export * from "./api-client/requests/remove-customer";
export * from "./api-client/requests/add-card";
export * from "./api-client/requests/get-card-list";
export * from "./api-client/requests/remove-card";

// SafeDeal API

export * from "./api-client/requests/create-sp-deal";
export * from "./api-client/requests/close-sp-deal";
