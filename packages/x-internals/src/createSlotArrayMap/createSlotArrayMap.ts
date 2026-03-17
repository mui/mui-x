export function createSlotArrayMap<T extends readonly string[]>(
  keys: T,
): { [K in T[number]]: [K] } {
  const result = {} as { [K in T[number]]: [K] };

  for (const key of keys) {
    const k = key as T[number];
    result[k] = [k];
  }

  return result;
}
