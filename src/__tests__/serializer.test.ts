import { Schema, SchemaPropertyType } from '../serialization/schema';
import { serializeData } from '../serialization/serializer';

describe('serializeData', () => {
  it('should convert MoneyToPenny', () => {
    const schema: Schema = [{ property: 'Amount', type: SchemaPropertyType.MoneyToPenny }];
    const result = serializeData({ data: { Amount: 10 }, schema });
    expect(result.Amount).toBe(1000);
  });

  it('should convert MoneyFromPenny', () => {
    const schema: Schema = [{ property: 'Amount', type: SchemaPropertyType.MoneyFromPenny }];
    const result = serializeData({ data: { Amount: 1000 }, schema });
    expect(result.Amount).toBe(10);
  });

  it('should convert BooleanToString', () => {
    const schema: Schema = [{ property: 'Flag', type: SchemaPropertyType.BooleanToString }];
    const result = serializeData({ data: { Flag: true }, schema });
    expect(result.Flag).toBe('true');
  });

  it('should convert BooleanFromString', () => {
    const schema: Schema = [{ property: 'Flag', type: SchemaPropertyType.BooleanFromString }];
    const result = serializeData({ data: { Flag: 'yes' }, schema });
    expect(result.Flag).toBe(true);
  });

  it('should convert IntegerToString', () => {
    const schema: Schema = [{ property: 'Count', type: SchemaPropertyType.IntegerToString }];
    const result = serializeData({ data: { Count: 42 }, schema });
    expect(result.Count).toBe('42');
  });

  it('should convert IntegerFromString', () => {
    const schema: Schema = [{ property: 'Count', type: SchemaPropertyType.IntegerFromString }];
    const result = serializeData({ data: { Count: '42' }, schema });
    expect(result.Count).toBe(42);
  });

  it('should convert DateToString', () => {
    const schema: Schema = [{ property: 'Date', type: SchemaPropertyType.DateToString }];
    const date = new Date('2023-01-15T00:00:00.000Z');
    const result = serializeData({ data: { Date: date }, schema });
    expect(typeof result.Date).toBe('string');
    expect(result.Date).toContain('2023-01-15');
  });

  it('should convert DateFromString', () => {
    const schema: Schema = [{ property: 'Date', type: SchemaPropertyType.DateFromString }];
    const result = serializeData({ data: { Date: '2023-01-15T00:00:00.000Z' }, schema });
    expect(result.Date).toBeInstanceOf(Date);
  });

  it('should convert ExpDateFromString', () => {
    const schema: Schema = [{ property: 'ExpDate', type: SchemaPropertyType.ExpDateFromString }];
    const result = serializeData({ data: { ExpDate: '1225' }, schema });
    expect(result.ExpDate).toBeInstanceOf(Date);
  });

  it('should skip optional missing properties', () => {
    const schema: Schema = [{ property: 'Opt', type: SchemaPropertyType.MoneyToPenny, optional: true }];
    const result = serializeData({ data: { Amount: 100 }, schema });
    expect(result).not.toHaveProperty('Opt');
  });

  it('should throw on required missing property', () => {
    const schema: Schema = [{ property: 'Required', type: SchemaPropertyType.MoneyToPenny }];
    expect(() => serializeData({ data: {}, schema })).toThrow('Failed to serialize property "Required"');
  });

  it('should ignore missing properties when ignoreMissing is true', () => {
    const schema: Schema = [{ property: 'Missing', type: SchemaPropertyType.MoneyToPenny }];
    expect(() => serializeData({ data: {}, schema, ignoreMissing: true })).not.toThrow();
  });

  it('should not mutate the original data object', () => {
    const schema: Schema = [{ property: 'Amount', type: SchemaPropertyType.MoneyToPenny }];
    const data = { Amount: 10, Other: 'value' };
    serializeData({ data, schema });
    expect(data.Amount).toBe(10);
  });

  it('should throw a wrapped error when serializer fails', () => {
    const schema: Schema = [{ property: 'Amount', type: SchemaPropertyType.MoneyToPenny }];
    expect(() => serializeData({ data: { Amount: 'not-a-number' as any }, schema })).toThrow(
      'Failed to serialize property "Amount"',
    );
  });
});
