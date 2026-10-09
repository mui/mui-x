// Copied from `@mui/material`'s unreleased `enhanceDensity` (private helper there).
// Typed structurally because `@mui/x-internals` has no `@mui/material` dependency:
// the generics infer slot and prop types from whatever `components` object the
// caller passes. If Material UI exports these helpers with the density release,
// drop this module and import from there.
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
export function addRootOverride<
  Components extends ThemeComponentsLike,
  Name extends Extract<keyof Components, string>,
  Slot extends ThemeComponentSlot<Components, Name> = Extract<
    ThemeComponentSlot<Components, Name>,
    'root'
  >,
>(
  components: Components,
  name: Name,
  overrides: NonNullable<StyleOverridesOf<Components, Name>[Slot]>,
  slot: Slot = 'root' as Slot,
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
