import type { CSSInterpolation, Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceProDensity } from '@mui/x-charts-pro/density';
import type { ChartsDensityComponents, DensityEnhancedTheme } from '@mui/x-charts-pro/density';
import { addRootOverride, getDensitySizing } from '@mui/x-internals/densityTheme';

// The palette option renders inside the data grid's charts panel and styles
// itself under the grid's theme name; that key is not typed in this package.
type ChartsPremiumDensityComponents = ChartsDensityComponents & {
  MuiDataGrid?: { styleOverrides?: Record<string, CSSInterpolation> };
};

/**
 * Make the Premium charts density-aware: the Pro enhancer first (which runs
 * the community one), then the Premium-only parts on top.
 *
 * The Pro enhancer returns a fresh theme with a fresh `components` object, so
 * this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceProDensity(theme);
  const { spacing } = theme;
  const { iconSize } = getDensitySizing(theme);
  const components: ChartsPremiumDensityComponents = enhanced.components;

  addRootOverride(components, 'MuiDataGrid', { gap: spacing('xSmall') }, 'paletteOptionRoot');
  // The palette swatch sits where a menu icon would, so it takes the glyph size.
  addRootOverride(
    components,
    'MuiDataGrid',
    { width: iconSize, height: iconSize },
    'paletteOptionIcon',
  );

  return enhanced;
}
