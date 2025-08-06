export function isStrictStringNumber(value: string): boolean {
  return /^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(value.trim());
}
