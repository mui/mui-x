import deepmerge from '@mui/utils/deepmerge';
import type { ThemeComponentsLike } from './addRootOverride';

// Copied from `@mui/material`'s unreleased `enhanceDensity`; see `addRootOverride`
// for why it is typed structurally and when to replace it with a Material UI import.
type DefaultPropsOf<Components extends ThemeComponentsLike, Name extends keyof Components> =
  NonNullable<Components[Name]> extends { defaultProps?: infer Props | undefined }
    ? NonNullable<Props>
    : never;

/**
 * Attach theme `defaultProps`, the consuming theme's own defaults winning — for
 * values CSS cannot reach (those that feed component JS). **Mutates
 * `components` in place** — same contract as `addRootOverride`.
 */
export function addDefaultProps<
  Components extends ThemeComponentsLike,
  Name extends Extract<keyof Components, string>,
>(components: Components, name: Name, defaults: DefaultPropsOf<Components, Name>): void {
  const component = components[name] as Record<string, any> | undefined;
  // Same merge as `createTheme` itself, so a user `slotProps.<slot>` keeps the
  // density keys it does not name instead of replacing the slot wholesale.
  (components as Record<string, any>)[name] = {
    ...component,
    defaultProps: deepmerge(defaults, component?.defaultProps ?? {}),
  };
}
