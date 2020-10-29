import { HttpRequestMethod } from '../../http-client/http-client';
import { Schema, SchemaPropertyType as PropType } from '../../serialization/schema';
import { ApiClient } from '../clients/api-client';
import { ResponsePayload as BaseResponsePayload } from '../response-payload';
import { validateAndPrepareCardData, validateAndPrepareReceipt } from './common/receipt';

/** https://oplata.tinkoff.ru/develop/api/payments/finishAuthorize-request/#CardData */
export interface ICardData {
  /** Номер карты	 */
  PAN: number;
  /** Месяц и год срока действия карты в формате MMYY */
  ExpData: Date;
  /** Имя и фамилия держателя карты Как на карте (как на карте)	 */
  CardHolder?: string;
  /** Код защиты	*/
  CVV: string;
  /**
   * Electronic Commerce Indicator. Индикатор, показывающий степень защиты, применяемую при предоставлении покупателем своих данных ТСП
   * Используется и является обязательным для Apple Pay или Google Pay.
   */
  ECI?: string;
  /**
   * Cardholder Authentication Verification Value или Accountholder Authentication Value
   * Используется и является обязательным для Apple Pay или Google Pay
   */
  CAVV?: string;
}

enum ERoute {
  ACQ = 'ACQ',
}

enum ESource {
  Cards = 'Cards',
  ApplePay = 'ApplePay',
  GooglePay = 'GooglePay',
}

//=========//
// REQUEST //
//=========//

/** @see https://oplata.tinkoff.ru/develop/api/payments/finishAuthorize-request/ */
export interface FinishAuthorizeRequestPayload {
  /**
   * Зашифрованные данные карты
   * Не используется и не является обязательным, если передается EncryptedPaymentData
   */
  CardData?: ICardData;
  /**
   * Данные карт
   * Используется и является обязательным только для Apple Pay или Google Pay
   */
  EncryptedPaymentData: string;
  /** Сумма в рублях */
  Amount?: number;
  /** Дополнительные параметры платежа в формате "ключ":"значение" (не более 20 пар) */
  DATA?: Record<string, string>;
  /** Email для отправки информации об оплате	 */
  InfoEmail?: string;
  /** IP-адрес клиента */
  IP?: string;
  /**  Уникальный идентификатор транзакции в системе Банка, полученный в ответе на вызов метода Init */
  PaymentId: number;
  /** Телефон клиента	*/
  Phone?: string;
  /** 
   * true – отправлять клиенту информацию на почту об оплате
   * false – не отправлять
   */
  SendEmail?: boolean;
  /** 
   * Способ платежа. Возможные значения: ACQ
   * Используется и является обязательным для Apple Pay или Google Pay
   */
  Route?: ERoute;
  /**
   * Источник платежа.
   * Используется и является обязательным для Apple Pay или Google Pay
   */
  Source?: ESource;
  Token?: string;
}


const finishAuthorizeRequestSchema: Schema = [
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

export interface FinishAuthorizeResponsePayload extends BaseResponsePayload {
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


const finishAuthorizeResponseSchema: Schema = [
  {
    property: 'Amount',
    type: PropType.MoneyFromPenny,
  },
  {
    property: 'ExpDate',
    type: PropType.ExpDateFromString,
  }
];


//==========//
// FUNCTION //
//==========//

export async function finishAuthorize(options: {
  apiClient: ApiClient;
  payload: FinishAuthorizeRequestPayload;

}): Promise<FinishAuthorizeResponsePayload> {

  const { apiClient } = options;

  const { CardData, ...restPayload } = options.payload;

  const $payload: any = {
    ...restPayload,
  };

  if (CardData) {
    $payload.CardData = validateAndPrepareCardData(CardData);
  }

  const response = await apiClient.sendRequest<FinishAuthorizeResponsePayload>({
    request: {
      url: 'FinishAuthorize',
      method: HttpRequestMethod.POST,
      payload: $payload,
    },
    requestSchema: finishAuthorizeRequestSchema,
    responseSchema: finishAuthorizeResponseSchema,
  });

  return response.payload;

}
