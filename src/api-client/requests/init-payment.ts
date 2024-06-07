import { Language } from "./common/language";
import { PayType } from "./common/pay-type";
import { validateAndPrepareReceipt } from "./common/receipt";
import { Receipt } from "./common/receipt";
import { PayloadType } from "../../common/payload-type";
import { HttpRequestMethod } from "../../http-client/http-client";
import {
  Schema,
  SchemaPropertyType as PropType,
} from "../../serialization/schema";
import { ApiClient } from "../clients/api-client";
import { ResponsePayload as BaseResponsePayload } from "../response-payload";

//=========//
// REQUEST //
//=========//

/**
 * @see https://acdn.tinkoff.ru/static/documents/bezopasnaya_sdelka.pdf
 */
export interface ITinkoffInitRequestData {
  /** Фамилия отправителя платежа */
  s_lastname: string;
  /** Имя отправителя платежа */
  s_firstname: string;
  /** Отчество отправителя платежа */
  s_middlename?: string;
  /** Дата рождения отправителя платежа в формате ДД.ММ.ГГГ */
  s_dateOfBirth: string;
  /** Гражданство отправителя (3-х буквенный ISO-код) */
  s_citizenship: string;
  /** Серия паспорта */
  s_passportSeries: string;
  /** Номер паспорта */
  s_pasportNumber: string;
  /** Дата выдачи паспорта в формате ДД.ММ.ГГГГ */
  s_passportIssueDate: string;
  /** Кем выдан паспорт */
  s_passportIssuedBy: string;
  /** Признак резидентности Клиента (0 – нерезидент, 1 – резидент) */
  s_resident?: string;
  /** Полный адрес отправителя */
  s_address?: string;
  /** Почтовый индекс */
  s_addressZip?: string;
  /** Страна. Указывается в формате ISO 3166-1 Numeric */
  s_addressCountry?: number;
  /** Город\Населенный пункт */
  s_addressCity?: string;
  /** Улица */
  s_addressStreet?: string;
  /** Номер дома */
  s_addressBuilding?: string;
  /** Номер квартиры */
  s_addressApartment?: string;
  /** Счет отправителя (номер карты или расчётный счёт) */
  s_accountNumber?: string;

  /** Фамилия получателя платежа */
  r_lastname?: string;
  /** Имя получателя платежа */
  r_firstname?: string;
  /** Отчество получателя платежа */
  r_middlename?: string;
  /** Номер договора займа */
  agreement_number?: string;

  /** Направление перевода. 0 – международный, 1 – внутри страны */
  t_domestic: 0 | 1;

  /**
   * Признак управления накоплением: если передано значение true, то начинается накопление суммы для выплаты продавцу
   */
  StartSpAccumulation?: null | "true" | "false" | "1N";

  /** Идентификатор созданного накопителя */
  SpAccumulationId?: string;

  /** Email покупателя */
  Email: string;

  /** Телефон покупателя */
  Phone: string;

  [key: string]: string | number | undefined | null;
}

/** @see https://oplata.tinkoff.ru/develop/api/payments/init-request/ */
export interface InitPaymentRequestPayload {
  OrderId: string;
  Amount?: number;
  /** Используется только в /e2c/Init */
  CardId?: number;
  IP?: string;
  Description?: string;
  Token?: string;
  Language?: Language;
  Recurrent?: "Y";
  /** Идентификатор покупателя в системе Продавца */
  CustomerKey?: string;
  RedirectDueDate?: Date;
  NotificationURL?: string;
  SuccessURL?: string;
  FailURL?: string;
  PayType?: PayType;
  Receipt?: Receipt;
  DATA?: Partial<ITinkoffInitRequestData> | string;
}

const initPaymentRequestSchema: Schema = [
  {
    property: "Amount",
    type: PropType.MoneyToPenny,
    optional: true,
  },
  {
    property: "RedirectDueDate",
    type: PropType.DateToString,
    optional: true,
  },
];

//==========//
// RESPONSE //
//==========//

export interface InitPaymentResponsePayload extends BaseResponsePayload {
  Amount: number;
  OrderId: string;
  PaymentId: number;
  CardId?: number;
  /** Card pan */
  Pan?: string;
  /** Card expiration date */
  ExpDate?: string;
  /** For recurrent payments */
  RebillId?: number;
  PaymentURL?: string;
}

const initPaymentResponseSchema: Schema = [
  {
    property: "Amount",
    type: PropType.MoneyFromPenny,
  },
  {
    property: "ExpDate",
    type: PropType.ExpDateFromString,
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

  const $payload: PayloadType = {
    ...restPayload,
  };

  if (Receipt) {
    $payload.Receipt = validateAndPrepareReceipt(Receipt);
  }

  const response = await apiClient.sendRequest<InitPaymentResponsePayload>({
    request: {
      url: "Init",
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: initPaymentRequestSchema,
    responseSchema: initPaymentResponseSchema,
  });

  return response.payload;
}
