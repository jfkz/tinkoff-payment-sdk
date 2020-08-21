
import { PaymentStatus } from '../common/payment-status';
import { Schema, SchemaPropertyType as PropType } from '../serialization/schema';


export interface WebhookPayload {
  TerminalKey: string;
  OrderId: string;
  Success: boolean;
  Status: PaymentStatus;
  PaymentId: number;
  ErrorCode: string;
  Amount: number;
  Rebilld?: number;
  CardId: number;
  Pan: string;
  ExpDate: string;
  Token: string;
  DATA?: string;
}

export const webhookPayloadSchema: Schema = [
  {
    property: 'PaymentId',
    type: PropType.IntegerFromString,
  },
  {
    property: 'Amount',
    type: PropType.IntegerFromString,
  },
  {
    property: 'Rebilld',
    type: PropType.IntegerFromString,
    optional: true,
  },
  {
    property: 'CardId',
    type: PropType.IntegerFromString,
    optional: true,
  },
  {
    property: 'Amount',
    type: PropType.MoneyFromPenny,
  },
];
