export function flatDataObject(data: Record<string, string> | string): string {
  if (typeof data === 'string') {
    return data;
  }
  const lines: string[] = [];
  for (const key in data) {
    lines.push(`${key}=${data[key]}`);
  }
  return lines.join('&');
}