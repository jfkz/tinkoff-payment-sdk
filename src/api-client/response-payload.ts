
/**
 * Payload properties common to all responses.
 */
export interface ResponsePayload {
  TerminalKey: string;
  Success: boolean;
  ErrorCode: string;
  Message?: string;
  Details?: string;
}
