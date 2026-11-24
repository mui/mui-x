// Copied from `@mui/material`'s `enhanceDensity`, which keeps it private (9.6.0).
// Typed structurally because `@mui/x-internals` has no `@mui/material` dependency.
export type ThemeComponentsLike = Record<string, any>;

type StyleOverridesOf<Components extends ThemeComponentsLike, Name extends keyof Components> =
  NonNullable<Components[Name]> extends { styleOverrides?: infer Overrides | undefined }
    ? NonNullable<Overrides>
    : never;

/** The slots (class keys) a component's `styleOverrides` accepts. */
export type ThemeComponentSlot<
  Components extends ThemeComponentsLike,
  Name extends keyof Components,
> = Extract<keyof StyleOverridesOf<Components, Name>, string>;

/**
 * Attach a `styleOverrides` object to a component slot as the first layer,
 * with any override the incoming theme already had as the last (winning) one:
 * enhancement provides defaults, it does not beat explicit customization.
 * Call it once per slot — a second call would wrap the first, putting the
 * user's layer between the two emissions. **Mutates `components` in place** —
 * pass a `components` object the caller owns.
 */
export function addStyleOverride<
  Components extends ThemeComponentsLike,
  Name extends Extract<keyof Components, string>,
  Slot extends ThemeComponentSlot<Components, Name>,
>(
  components: Components,
  name: Name,
  slot: Slot,
  overrides: NonNullable<StyleOverridesOf<Components, Name>[Slot]>,
): void {
  const component = components[name] as Record<string, any> | undefined;
  const existing = component?.styleOverrides?.[slot];
  (components as Record<string, any>)[name] = {
    ...component,
    styleOverrides: {
      ...component?.styleOverrides,
      [slot]: existing === undefined ? [overrides] : [overrides, existing],
    },
  };
}
