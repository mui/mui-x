type DataAttributeMap = Record<string, string | number | boolean | undefined | null>;

/**
 * Converts a camelCase key to kebab-case.
 * e.g. "isSubmitting" → "is-submitting", "hasValue" → "has-value"
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/**
 * Converts a state mapping object into data-attribute props.
 * - boolean `true` → `data-{key}="true"`
 * - boolean `false`, `null`, `undefined` → attribute omitted
 * - string/number → `data-{key}="{value}"`
 *
 * Keys are converted from camelCase to kebab-case to produce
 * valid lowercase data attributes (e.g. `isSubmitting` → `data-is-submitting`).
 */
export function getDataAttributes(state: DataAttributeMap): Record<string, string | ''> {
  const result: Record<string, string | ''> = {};

  for (const [key, value] of Object.entries(state)) {
    if (value === undefined || value === null || value === false) {
      continue;
    }

    result[`data-${camelToKebab(key)}`] = String(value);
  }

  return result;
}
