import { formatISO } from 'date-fns';

export function dateToStringOrThrow(value: Date): string {


  // noinspection SuspiciousTypeOfGuard
  if (!(value instanceof Date)) {
    throw new Error('Value must be a valid JavaScript Date');
  }

  return formatISO(value);

}

export function dateFromStringOrThrow(value: string): Date {

  // noinspection SuspiciousTypeOfGuard
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }

  return new Date(
    Date.parse(value)
  );

}

export function expDateFromStringOrThrow(value: string): Date {

  // noinspection SuspiciousTypeOfGuard
  if (typeof value !== 'string' || value.length !== 4) {
    throw new Error('Value must be a string with 4 symbols length');
  }

  const month = parseInt(value.slice(0, 2), 10) - 1;
  const year = parseInt(value.slice(2, 4), 10) - 2000;

  return new Date(year, month);

}
