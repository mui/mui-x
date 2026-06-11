import * as React from 'react';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system/styleFunctionSx';
import type { PlaygroundClassCustomization } from './PlaygroundCard';
import { parseSx } from './parseSx';

/**
 * Helper for wiring up the Classes tab of a playground.
 *
 * Provide a list of `{name, description, selector?}` entries and the hook returns
 * - `customizations` — pass into `classCustomizations`
 * - `reset` — pass into `onClassesReset`
 * - `toClassesSx` — build a merged outer `sx` object (root flat + others nested
 *    under their selector)
 */
export interface CustomizationDef<K extends string> {
  name: K;
  description?: string;
  /** CSS selector that scopes the sx block (omit for the root key). */
  selector?: string;
  /** Seed value used as the initial editor text. */
  initialValue?: string;
}

export interface UseCustomizationsResult<K extends string> {
  customizations: PlaygroundClassCustomization[];
  reset: () => void;
  /** Raw editor text values keyed by name (useful for the copyCode helper). */
  values: Record<K, string>;
  // eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
  /**
   * Build the merged outer `sx` object for class customizations.
   * Pass a `base` to seed initial keys; the `root` entry merges flat,
   * everything else nests under its selector. Returned as a style object
   * — the caller passes it directly to a component's `sx`.
   */
  toClassesSx: (base?: SystemStyleObject<Theme>) => SystemStyleObject<Theme>;
}

function buildInitialValues<K extends string>(
  defs: ReadonlyArray<CustomizationDef<K>>,
): Record<K, string> {
  return defs.reduce(
    (acc, def) => {
      acc[def.name] = def.initialValue ?? '';
      return acc;
    },
    {} as Record<K, string>,
  );
}

export function useCustomizations<K extends string>(
  defs: ReadonlyArray<CustomizationDef<K>>,
): UseCustomizationsResult<K> {
  const keys = React.useMemo<readonly K[]>(() => defs.map((d) => d.name), [defs]);
  const [values, setValues] = React.useState<Record<K, string>>(() => buildInitialValues(defs));

  // Resync when the set of keys changes (rare but defensive).
  React.useEffect(() => {
    setValues((prev) => {
      const next = buildInitialValues(defs);
      for (const k of keys) {
        // Preserve any previously-present value, including an empty string the
        // user intentionally cleared (only genuinely new keys take the seed).
        if (k in prev) {
          next[k] = prev[k];
        }
      }
      return next;
    });
  }, [defs, keys]);

  const customizations = React.useMemo<PlaygroundClassCustomization[]>(
    () =>
      defs.map((def) => {
        const parsed = parseSx(values[def.name]);
        return {
          name: def.name,
          description: def.description,
          selector: def.selector,
          sx: values[def.name],
          parseError: parsed.error,
          onSxChange: (next) => setValues((prev) => ({ ...prev, [def.name]: next })),
        };
      }),
    [defs, values],
  );

  const reset = React.useCallback(() => {
    setValues(buildInitialValues(defs));
  }, [defs]);

  const toClassesSx = React.useCallback(
    (base?: SystemStyleObject<Theme>): SystemStyleObject<Theme> => {
      const out: Record<string, unknown> = { ...(base ?? {}) };
      for (const def of defs) {
        const parsed = parseSx(values[def.name]);
        if (!parsed.value) {
          continue;
        }
        if (def.name === 'root' || !def.selector) {
          Object.assign(out, parsed.value);
        } else {
          out[`& ${def.selector}`] = parsed.value;
        }
      }
      return out as SystemStyleObject<Theme>;
    },
    [defs, values],
  );

  return { customizations, reset, values, toClassesSx };
}

export default useCustomizations;
