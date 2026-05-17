import * as React from 'react';

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

function buildInitialValues(defs) {
  return defs.reduce((acc, def) => {
    acc[def.name] = def.initialValue ?? '';
    return acc;
  }, {});
}

export function useCustomizations(defs) {
  const keys = React.useMemo(() => defs.map((d) => d.name), [defs]);
  const [values, setValues] = React.useState(() => buildInitialValues(defs));

  // Resync when the set of keys changes (rare but defensive).
  React.useEffect(() => {
    setValues((prev) => {
      const next = buildInitialValues(defs);
      for (const k of keys) {
        if (prev[k] != null && prev[k] !== '') {
          next[k] = prev[k];
        }
      }
      return next;
    });
  }, [defs, keys]);

  const customizations = React.useMemo(
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
    (base) => {
      const out = { ...(base ?? {}) };
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
      return out;
    },
    [defs, values],
  );

  return { customizations, reset, values, toClassesSx };
}
