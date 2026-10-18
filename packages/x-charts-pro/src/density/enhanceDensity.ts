import type { CSSInterpolation, Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-charts/density';
import type { ChartsDensityComponents, DensityEnhancedTheme } from '@mui/x-charts/density';
import { addRootOverride } from '@mui/x-internals/densityTheme';

// The heatmap tooltip resolves theme overrides by name, but the charts theme
// augmentation does not list it, so its key is typed loosely here.
type ChartsProDensityComponents = ChartsDensityComponents & {
  MuiChartsHeatmapTooltip?: { styleOverrides?: Record<string, CSSInterpolation> };
};

/**
 * Make the Pro charts density-aware: the community enhancer first, then the
 * Pro-only HTML parts on top.
 *
 * The community enhancer returns a fresh theme with a fresh `components`
 * object, so this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceCommunityDensity(theme);
  const { spacing } = theme;
  const components: ChartsProDensityComponents = enhanced.components;

  addRootOverride(components, 'MuiChartsToolbar', { marginInline: spacing('xxSmall') }, 'divider');
  // Mirrors the community tooltip caption.
  addRootOverride(
    components,
    'MuiChartsHeatmapTooltip',
    {
      padding: `${spacing('xxSmall')} ${spacing('small')}`,
      '& span': { marginRight: spacing('small') },
    },
    'axesValue',
  );

  return enhanced;
}
