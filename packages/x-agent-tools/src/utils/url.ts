/** True if `value` parses as an absolute URL. */
export function isUrlLike(value: string): boolean {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}
