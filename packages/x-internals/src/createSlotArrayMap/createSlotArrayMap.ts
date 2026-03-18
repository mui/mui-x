import capitalize from '@mui/utils/capitalize';

export function createSlotArrayMap<T extends readonly string[]>(
  keys: T,
  rootPrefix = '',
): { [K in T[number]]: [K] } {
  const result = {} as { [K in T[number]]: [K] };

  for (const key of keys) {
    const k = key as T[number];
    if (rootPrefix) {
      if (key === 'root') {
        result[k] = [rootPrefix];
      } else {
        result[k] = [rootPrefix + capitalize(k)];
      }
    } else {
      result[k] = [k];
    }
  }

  return result;
}
