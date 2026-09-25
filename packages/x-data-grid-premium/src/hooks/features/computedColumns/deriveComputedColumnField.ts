const DEFAULT_FIELD = 'computed';

/**
 * Derives the field of a computed column from its header name: the words are
 * joined in camelCase (`Total price` → `totalPrice`), a name without letters or
 * digits falls back to `computed`, and a field already in use gets a numeric
 * suffix (`totalPrice2`, `totalPrice3`…).
 * @param {string} headerName The header name typed by the user.
 * @param {Iterable<string>} existingFields The fields the result must not collide with.
 * @returns {string} A unique field name.
 */
export function deriveComputedColumnField(
  headerName: string,
  existingFields: Iterable<string>,
): string {
  const words = headerName.split(/[^A-Za-z0-9]+/).filter((word) => word !== '');
  let base = words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
  if (base === '') {
    base = DEFAULT_FIELD;
  } else if (/^\d/.test(base)) {
    // A field cannot start with a digit (the formula grammar reads it as a number).
    base = `_${base}`;
  }

  const taken = new Set(existingFields);
  if (!taken.has(base)) {
    return base;
  }
  let suffix = 2;
  while (taken.has(`${base}${suffix}`)) {
    suffix += 1;
  }
  return `${base}${suffix}`;
}
