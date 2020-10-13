import { PaymentStatus } from '../common/payment-status';

/**
 * Payload properties common to all responses.
 */
export interface ResponsePayload {
  /** Идентификатор терминала. Выдается продавцу банком при заведении терминала	 */
  TerminalKey: string;
  /** Выполнение платежа */
  Success: boolean;
  /** Код ошибки.\n Если ошибки не произошло, передайте значение «0» */
  ErrorCode: string;
  /** Статус платежа */
  Status: PaymentStatus;
  /** Краткое описание ошибки	*/
  Message?: string;
  /** Подробное описание ошибки	*/
  Details?: string;
}
