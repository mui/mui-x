// Local mirror of `DensityKey` from `@mui/material/styles` (density is not released
// there yet). Replace with the Material UI import once the peer range includes it,
// so the packages cannot drift.
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

// Typed structurally because `@mui/x-internals` has no `@mui/material` dependency,
// and Material UI's released `Theme` has no density fields yet.
type DensityEnhancedThemeLike = {
  unstable_densityScale?: DensityScale;
  touchTarget?: string;
  iconSize?: string;
  vars?: { touchTarget?: string; iconSize?: string } | null;
};

/**
 * The scale `@mui/material`'s `unstable_enhanceDensity` left on the theme.
 * Throws when it is missing: every X enhancer needs it, and there is no
 * fallback ladder on the X side.
 */
export function getDensityScale(theme: object): DensityScale {
  const scale = (theme as DensityEnhancedThemeLike).unstable_densityScale;
  if (!scale) {
    throw new Error(
      "MUI X: `unstable_enhanceDensity` needs a theme enhanced by `@mui/material`'s `unstable_enhanceDensity` first (`theme.unstable_densityScale` is missing).",
    );
  }
  return scale;
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
export function getDensitySizing(theme: object): DensitySizing {
  const enhanced = theme as DensityEnhancedThemeLike;
  const touchTarget = enhanced.vars?.touchTarget ?? enhanced.touchTarget;
  const iconSize = enhanced.vars?.iconSize ?? enhanced.iconSize;
  if (!touchTarget || !iconSize) {
    throw new Error(
      "MUI X: `unstable_enhanceDensity` needs a theme enhanced by `@mui/material`'s `unstable_enhanceDensity` first (`theme.touchTarget` / `theme.iconSize` are missing).",
    );
  }
  return { touchTarget, iconSize };
}
