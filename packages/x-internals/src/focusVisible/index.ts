/**
 * Consumption-side mirror of `@mui/material/src/styles/focusVisible.ts`.
 *
 * Material UI resolves `theme.focusVisible` but only exports the `FocusVisible` *type*; the
 * helpers below are module-internal there, and `@mui/material/styles/focusVisible` is not a
 * resolvable subpath (the published `exports` map has no wildcard, and `./styles` re-exports the
 * type alone). Verified against `@mui/material@9.4.0`. Until they are exported publicly, MUI X
 * duplicates them here.
 *
 * The private variable names MUST stay byte-identical to core's — they are the contract that lets
 * a core clip-prone ancestor and an X descendant agree on whether the ring insets.
 *
 * Deliberately NOT duplicated: `resolveFocusVisible`, `wireFocusVisibleVars`,
 * `mergeFocusVisibleInput`, `isResolvedFocusVisible`. Those run inside `createTheme`, and MUI X
 * never builds a theme — it only reads the resolved `theme.focusVisible`, which is typed on
 * `Theme` as of v9.4.0 and simply `undefined` on the older versions X still peers.
 */

const focusVisibleOffsetVar = '--_focusVisible-offset';
const focusVisibleBehaviorVar = '--_focusVisible-behavior';
const focusVisibleShadowVar = '--_focusVisible-shadow';

/**
 * Spread on a root whose ring must stay outset: the inset vars inherit, so a clip-prone ancestor
 * would otherwise inset a descendant's ring too.
 */
export const outsetFocusRing = {
  [focusVisibleOffsetVar]: 1,
  // Reverts the var to guaranteed-invalid so `var(--_focusVisible-behavior, )` falls back to
  // empty — there is no explicit `outset` keyword.
  [focusVisibleBehaviorVar]: 'initial',
};

/**
 * Clip-prone roots spread this to inset the ring, so an `overflow: hidden` ancestor cannot clip
 * it — without the component knowing the ring width. `offset` multiplies the ring's own
 * `outlineOffset`, so 1 mirrors it inward.
 */
export function applyInsetFocusVisible(offset: number) {
  return {
    [focusVisibleOffsetVar]: -offset,
    [focusVisibleBehaviorVar]: 'inset',
  };
}

/**
 * Used by colored-background surfaces to make the ring readable through `box-shadow`.
 */
export function applyChildrenFocusVisible(color: string) {
  return {
    [focusVisibleShadowVar]: color,
  };
}
