type DataAttributeMap = Record<string, string | number | boolean | undefined | null>;

/**
 * Converts a state mapping object into data-attribute props.
 * - boolean `true` → `data-{key}=""` (presence = true)
 * - boolean `false`, `null`, `undefined` → attribute omitted
 * - string/number → `data-{key}="{value}"`
 */
export function getDataAttributes(state: DataAttributeMap): Record<string, string | ''> {
  const result: Record<string, string | ''> = {};

  for (const [key, value] of Object.entries(state)) {
    if (value === undefined || value === null || value === false) {
      continue;
    }

    result[`data-${key}`] = value === true ? '' : String(value);
  }

  return result;
}
