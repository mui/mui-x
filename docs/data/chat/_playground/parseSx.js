/**
 * Safely evaluates a user-typed `sx` object literal. Returns the parsed
 * value, or an error string when parsing failed. The empty string yields
 * `undefined` (no override).
 *
 * NOTE: Uses the Function constructor; users type the string themselves
 * inside an interactive docs playground — they cannot inject code into
 * another user's session.
 */
export function parseSx(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { value: undefined, error: undefined };
  }
  try {
    // Allow either bare object `{ … }` or expression-wrapped `({ … })`.
    const body = trimmed.startsWith('{') ? `(${trimmed})` : trimmed;
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${body});`)();
    if (result === null || typeof result !== 'object' || Array.isArray(result)) {
      return { value: undefined, error: 'sx must be an object literal.' };
    }
    return { value: result, error: undefined };
  } catch (error) {
    return {
      value: undefined,
      error: error instanceof Error ? error.message : 'Invalid sx expression.',
    };
  }
}
