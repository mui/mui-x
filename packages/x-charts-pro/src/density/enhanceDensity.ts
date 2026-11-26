import type { CSSInterpolation, Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-charts/density';
import type { ChartsDensityComponents, DensityEnhancedTheme } from '@mui/x-charts/density';
import { addStyleOverride } from '@mui/x-internals/densityTheme';

// The heatmap tooltip resolves theme overrides by name, but the charts theme
// augmentation does not list it, so its key is typed loosely here.
type ChartsProDensityComponents = ChartsDensityComponents & {
  MuiChartsHeatmapTooltip?: { styleOverrides?: Record<string, CSSInterpolation> };
  MuiChartsZoomSliderTooltip?: { styleOverrides?: Record<string, CSSInterpolation> };
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

  addStyleOverride(components, 'MuiChartsToolbar', 'divider', { marginInline: spacing('xxSmall') });
  // Mirrors the community tooltip caption.
  addStyleOverride(components, 'MuiChartsHeatmapTooltip', 'axesValue', {
    padding: `${spacing('xxSmall')} ${spacing('small')}`,
    '& span': { marginRight: spacing('small') },
  });
  addStyleOverride(components, 'MuiChartsZoomSliderTooltip', 'root', {
    '& > div': { paddingInline: spacing('xxSmall') },
  });

  return enhanced;
}
