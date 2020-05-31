
export function moneyToPennyOrThrow(value: number): number {

  // noinspection SuspiciousTypeOfGuard
  if (typeof value !== 'number') {
    throw new Error(`Value must be a number`);
  }

  return Math.floor(value * 100);

}

export function moneyFromPennyOrThrow(value: number): number {

  // noinspection SuspiciousTypeOfGuard
  if (typeof value !== 'number') {
    throw new Error(`Value must be a number`);
  }

  return Math.floor(value) / 100;

}
