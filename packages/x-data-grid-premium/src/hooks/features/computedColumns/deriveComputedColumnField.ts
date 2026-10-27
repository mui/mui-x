const DEFAULT_FIELD = 'computed';

/**
 * The grid keeps its columns in plain objects, so a field named after a member
 * of `Object.prototype` (`constructor`, `toString`…) reads as an existing column
 * everywhere the lookup is indexed: such a field is never a valid computed column.
 */
const RESERVED_FIELDS: ReadonlySet<string> = new Set(Object.getOwnPropertyNames(Object.prototype));

/**
 * Whether a field name is reserved and cannot name a computed column.
 * @param {string} field The field to check.
 * @returns {boolean} `true` when the field is a member of `Object.prototype`.
 */
export function isReservedComputedColumnField(field: string): boolean {
  return RESERVED_FIELDS.has(field);
}

/**
 * Derives the field of a computed column from its header name: the words are
 * joined in camelCase (`Total price` → `totalPrice`), a name without letters or
 * digits falls back to `computed`, and a field already in use (or reserved) gets
 * a numeric suffix (`totalPrice2`, `totalPrice3`…).
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
  RESERVED_FIELDS.forEach((field) => taken.add(field));
  if (!taken.has(base)) {
    return base;
  }
  let suffix = 2;
  while (taken.has(`${base}${suffix}`)) {
    suffix += 1;
  }
  return `${base}${suffix}`;
}
