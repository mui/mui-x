export function notNull<T>(value: T): value is NonNullable<T> {
  return value !== null;
}
