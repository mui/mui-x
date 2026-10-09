import type { Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceProDensity } from '@mui/x-data-grid-pro/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid-pro/density';

/**
 * Make the Data Grid Premium density-aware: the Pro enhancer first (which runs
 * the community one), then the Premium-only slots and props on top.
 *
 * The Pro enhancer returns a fresh theme with a fresh `components` object, so
 * this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceProDensity(theme);
  return enhanced;
}
