
import { get as getByPath, set as setByPath } from 'lodash';

import { Schema, SchemaPropertyType } from './schema';
import { booleanFromString, booleanToString } from './serializers/boolean';
import { dateFromStringOrThrow, dateToStringOrThrow, expDateFromStringOrThrow } from './serializers/date';
import { integerFromString, integerToString } from './serializers/integer';
import { moneyFromPennyOrThrow, moneyToPennyOrThrow } from './serializers/money';


// eslint-disable-next-line @typescript-eslint/ban-types
export function serializeData<DataType extends {}>(options: {
  data: DataType;
  schema: Schema;
  ignoreMissing?: boolean;

}): DataType {

  const {
    schema,
    ignoreMissing,

  } = options;

  // Shallow cloning the data
  const data = { ...options.data };

  for (const { property, type, optional } of schema) {

    try {

      let value = getByPath(data, property);

      // Checking missing value
      if (value === undefined) {
        if (!optional && !ignoreMissing) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error('Required property is missing');
        } else {
          continue;
        }
      }

      switch (type) {
      case SchemaPropertyType.MoneyToPenny:
        value = moneyToPennyOrThrow(value);
        break;

      case SchemaPropertyType.MoneyFromPenny:
        value = moneyFromPennyOrThrow(value);
        break;

      case SchemaPropertyType.DateToString:
        value = dateToStringOrThrow(value);
        break;

      case SchemaPropertyType.DateFromString:
        value = dateFromStringOrThrow(value);
        break;

      case SchemaPropertyType.ExpDateFromString:
        value = expDateFromStringOrThrow(value);
        break;

      case SchemaPropertyType.BooleanToString:
        value = booleanToString(value);
        break;

      case SchemaPropertyType.BooleanFromString:
        value = booleanFromString(value);
        break;

      case SchemaPropertyType.IntegerToString:
        value = integerToString(value);
        break;

      case SchemaPropertyType.IntegerFromString:
        value = integerFromString(value);
        break;
      }

      setByPath(data, property, value);

    } catch (error) {
      throw new Error(
        `Failed to serialize property "${property}": ${(error as Error).message} ` +
        `using "${type}" serializer`
      );

    }

  }

  return data;

}
