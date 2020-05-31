
export function dateToStringOrThrow(value: Date): string {

  // noinspection SuspiciousTypeOfGuard
  if (!(value instanceof Date)) {
    throw new Error(`Value must be a valid JavaScript Date`);
  }

  return value.toISOString();

}

export function dateFromStringOrThrow(value: string): Date {

  // noinspection SuspiciousTypeOfGuard
  if (typeof value !== 'string') {
    throw new Error(`Value must be a string`);
  }

  return new Date(
    Date.parse(value)
  );

}
