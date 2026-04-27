export function getAsNumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}
