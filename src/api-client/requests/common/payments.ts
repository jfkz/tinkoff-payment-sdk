export interface Payments {
  /** Уникальный идентификатор транзакции в системе Банка */
  PaymentId: number;
  /** Статус транзакции */
  Status: string;
  /** Сумма операции в копейках */
  Amount?: number;
  /** RRN операции */
  Rrn?: string;
}
