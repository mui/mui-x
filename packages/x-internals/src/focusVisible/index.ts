import type * as React from 'react';

/**
 * Consumption-side mirror of `@mui/material/src/styles/focusVisible.ts`.
 *
 * Material UI resolves `theme.focusVisible` but only exports the `FocusVisible` *type*; the
 * helpers below are module-internal there, and `@mui/material/styles/focusVisible` is not a
 * resolvable subpath (the published `exports` map has no wildcard). Until they are exported
 * publicly, MUI X duplicates them here.
 *
 * The private variable names MUST stay byte-identical to core's — they are the contract that lets
 * a core clip-prone ancestor and an X descendant agree on whether the ring insets.
 *
 * Deliberately NOT duplicated: `resolveFocusVisible`, `wireFocusVisibleVars`,
 * `mergeFocusVisibleInput`, `isResolvedFocusVisible`. Those run inside `createTheme`, and MUI X
 * never builds a theme — it only reads the resolved `theme.focusVisible`.
 */

const focusVisibleOffsetVar = '--_focusVisible-offset';
const focusVisibleBehaviorVar = '--_focusVisible-behavior';
const focusVisibleShadowVar = '--_focusVisible-shadow';

/** Resolved `theme.focusVisible`, spread onto the focus state of a component. */
export type FocusVisibleStyles = React.CSSProperties;

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

/**
 * `theme.focusVisible` is absent from the `Theme` type on the `@mui/material` versions MUI X still
 * supports (`^7.3.0`, and `^9.0.0` before the ring shipped), so reading it directly does not
 * compile. This keeps the cast in one place instead of at every call site.
 *
 * Returns `undefined` when the ring is opted out (`undefined`) or explicitly disabled (`false`),
 * which is what makes every call site a no-op by default.
 */
export function getThemeFocusVisible(theme: unknown): FocusVisibleStyles | undefined {
  const focusVisible = (theme as { focusVisible?: FocusVisibleStyles | false } | null)
    ?.focusVisible;
  return focusVisible || undefined;
}
