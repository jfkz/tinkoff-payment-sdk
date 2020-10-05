import { PaymentStatus } from '../common/payment-status';

/**
 * Payload properties common to all responses.
 */
export interface ResponsePayload {
  TerminalKey: string;
  Success: boolean;
  ErrorCode: string;
  Status: PaymentStatus;
  Message?: string;
  Details?: string;
}
