export function v7<T extends Function>(fn: T): T & { v7: true } {
  const result = fn as unknown as T & { v7: true };
  result.v7 = true;
  return result;
}
