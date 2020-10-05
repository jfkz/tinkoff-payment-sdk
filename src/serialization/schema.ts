
export type Schema = SchemaItem[];

export interface SchemaItem {
  property: string;
  type: SchemaPropertyType;
  optional?: boolean;
}

export enum SchemaPropertyType {
  MoneyToPenny = 'MoneyToPenny',
  MoneyFromPenny = 'MoneyFromPenny',
  DateToString = 'DateToString',
  DateFromString = 'DateFromString',
  ExpDateFromString = 'ExpDateFromString',
  BooleanToString = 'BooleanToString',
  BooleanFromString = 'BooleanFromString',
  IntegerToString = 'IntegerToString',
  IntegerFromString = 'IntegerFromString',
}
