import type { Theme } from '@mui/material/styles';

// Local mirror of `DensityKey` from `@mui/material/styles` (density is not released
// there yet). Replace with the Material UI import once the peer range includes it,
// so the two packages cannot drift.
export type DensityStepKey =
  'xxSmall' | 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge';

/**
 * The scale a theme ended up with, in px, as written to
 * `theme.unstable_densityScale` by `@mui/material`'s `unstable_enhanceDensity`.
 *
 * Local mirror of `ResolvedDensityScale` from `@mui/material/styles`; replace with
 * that import once Material UI releases density.
 */
export interface DensityScale {
  touchTarget: number;
  iconSize: number;
  spacing: Record<DensityStepKey, number>;
}

// Material UI's released `Theme` has no `unstable_densityScale` / `touchTarget`
// yet; once it does, both are readable from `Theme` directly and this
// intersection goes away.
type DensityEnhanced = {
  unstable_densityScale?: DensityScale;
  touchTarget?: string;
  iconSize?: string;
  vars?: { touchTarget?: string; iconSize?: string };
};

/**
 * The scale `@mui/material`'s `unstable_enhanceDensity` left on the theme.
 * Throws when it is missing: every tier's enhancer needs it, and there is no
 * fallback ladder on the X side.
 */
export function getDensityScale(theme: Theme): DensityScale {
  const scale = (theme as Theme & DensityEnhanced).unstable_densityScale;
  if (!scale) {
    throw new Error(
      "MUI X: `unstable_enhanceDensity` needs a theme enhanced by `@mui/material`'s `unstable_enhanceDensity` first (`theme.unstable_densityScale` is missing).",
    );
  }
  return scale;
}

/**
 * The height of a grid row-like box (row, column header, header filter row) on
 * a scale: the touch target plus one xxSmall step above and below. JS-gated in
 * the grid (it feeds the virtualizer), so it ships as `defaultProps`, not CSS.
 */
export function gridDensityHeight(scale: DensityScale): number {
  return scale.touchTarget + 2 * scale.spacing.xxSmall;
}

/** The sizing constants as CSS lengths, the way material's presets read them. */
export interface DensitySizing {
  touchTarget: string;
  iconSize: string;
}

/**
 * `(theme.vars || theme).touchTarget` / `.iconSize`: the var reference with its
 * px fallback on a vars theme, the px literal otherwise. Boxes step off
 * `touchTarget` and glyphs off `iconSize` with `calc()`, so an override of
 * either constant carries every derived size.
 */
export function getDensitySizing(theme: Theme): DensitySizing {
  const enhanced = theme as Theme & DensityEnhanced;
  const touchTarget = enhanced.vars?.touchTarget ?? enhanced.touchTarget;
  const iconSize = enhanced.vars?.iconSize ?? enhanced.iconSize;
  if (!touchTarget || !iconSize) {
    throw new Error(
      "MUI X: `unstable_enhanceDensity` needs a theme enhanced by `@mui/material`'s `unstable_enhanceDensity` first (`theme.touchTarget` / `theme.iconSize` are missing).",
    );
  }
  return { touchTarget, iconSize };
}
