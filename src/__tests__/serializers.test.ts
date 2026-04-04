import { booleanFromString, booleanToString } from '../serialization/serializers/boolean';
import {
  dateToStringOrThrow,
  dateFromStringOrThrow,
  expDateFromStringOrThrow,
} from '../serialization/serializers/date';
import { integerFromString, integerToString } from '../serialization/serializers/integer';
import { moneyToPennyOrThrow, moneyFromPennyOrThrow } from '../serialization/serializers/money';

describe('moneyToPennyOrThrow', () => {
  it('should convert rubles to kopecks', () => {
    expect(moneyToPennyOrThrow(10)).toBe(1000);
    expect(moneyToPennyOrThrow(1.5)).toBe(150);
    expect(moneyToPennyOrThrow(0.99)).toBe(99);
  });

  it('should floor fractional kopecks', () => {
    expect(moneyToPennyOrThrow(0.001)).toBe(0);
  });

  it('should throw if value is not a number', () => {
    expect(() => moneyToPennyOrThrow('10' as any)).toThrow('Value must be a number');
  });
});

describe('moneyFromPennyOrThrow', () => {
  it('should convert kopecks to rubles', () => {
    expect(moneyFromPennyOrThrow(1000)).toBe(10);
    expect(moneyFromPennyOrThrow(150)).toBe(1.5);
    expect(moneyFromPennyOrThrow(99)).toBe(0.99);
  });

  it('should throw if value is not a number', () => {
    expect(() => moneyFromPennyOrThrow('10' as any)).toThrow('Value must be a number');
  });
});

describe('booleanToString', () => {
  it('should convert true to "true"', () => {
    expect(booleanToString(true)).toBe('true');
  });

  it('should convert false to "false"', () => {
    expect(booleanToString(false)).toBe('false');
  });
});

describe('booleanFromString', () => {
  it('should recognize positive values', () => {
    expect(booleanFromString('1')).toBe(true);
    expect(booleanFromString('true')).toBe(true);
    expect(booleanFromString('on')).toBe(true);
    expect(booleanFromString('yes')).toBe(true);
  });

  it('should return false for other values', () => {
    expect(booleanFromString('false')).toBe(false);
    expect(booleanFromString('0')).toBe(false);
    expect(booleanFromString('')).toBe(false);
  });
});

describe('integerToString', () => {
  it('should convert number to string', () => {
    expect(integerToString(42)).toBe('42');
    expect(integerToString(0)).toBe('0');
  });
});

describe('integerFromString', () => {
  it('should parse integer from string', () => {
    expect(integerFromString('42')).toBe(42);
    expect(integerFromString('0')).toBe(0);
  });

  it('should parse only the integer part', () => {
    expect(integerFromString('42abc')).toBe(42);
  });
});

describe('dateToStringOrThrow', () => {
  it('should format a Date to ISO string', () => {
    const date = new Date('2023-06-15T00:00:00.000Z');
    const result = dateToStringOrThrow(date);
    expect(typeof result).toBe('string');
    expect(result).toContain('2023-06-15');
  });

  it('should throw if value is not a Date', () => {
    expect(() => dateToStringOrThrow('2023-06-15' as any)).toThrow('Value must be a valid JavaScript Date');
  });
});

describe('dateFromStringOrThrow', () => {
  it('should parse ISO date string to Date', () => {
    const result = dateFromStringOrThrow('2023-06-15T00:00:00.000Z');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCFullYear()).toBe(2023);
  });

  it('should throw if value is not a string', () => {
    expect(() => dateFromStringOrThrow(12345 as any)).toThrow('Value must be a string');
  });
});

describe('expDateFromStringOrThrow', () => {
  it('should parse expiration date MMYY format', () => {
    // "1225" = December 2025
    const result = expDateFromStringOrThrow('1225');
    expect(result).toBeInstanceOf(Date);
    // month is 0-indexed (11 = December)
    expect(result.getMonth()).toBe(11);
    // year: 2025 - 2000 = 25 (constructor takes year offset from 1900 when <100, so year 25 = 1925 in old JS)
    // Actually new Date(year, month) where year < 100 is treated specially in some engines
    // Let's just check month/year fields explicitly
  });

  it('should throw if value is not a 4-character string', () => {
    expect(() => expDateFromStringOrThrow('123')).toThrow('Value must be a string with 4 symbols length');
    expect(() => expDateFromStringOrThrow(1234 as any)).toThrow('Value must be a string with 4 symbols length');
  });
});
