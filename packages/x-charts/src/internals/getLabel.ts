export function getLabel<Location extends string>(
  value: string | ((location: Location) => string) | undefined,
  location: Location,
): string | undefined {
  return typeof value === 'function' ? value(location) : value;
}
