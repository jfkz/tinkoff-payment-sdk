
export function booleanToString(value: boolean): string {

  return String(value);

}

export function booleanFromString(value: string): boolean {

  const positiveValues = [
    '1',
    'true',
    'on',
    'yes',
  ];

  return positiveValues.includes(value);

}
