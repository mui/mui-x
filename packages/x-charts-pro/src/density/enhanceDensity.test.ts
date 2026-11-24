import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import type { ChartsDensityComponents } from '@mui/x-charts/density';
import { enhanceDensity } from './enhanceDensity';

describe('enhanceDensity', () => {
  it('adds the toolbar divider and heatmap tooltip on top of the community emissions', () => {
    const input = enhanceMaterial(createTheme());
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(
      (theme.components as ChartsDensityComponents).MuiChartsToolbar?.styleOverrides?.divider,
    ).toEqual([{ marginInline: '4px' }]);
    expect((theme.components as any).MuiChartsHeatmapTooltip.styleOverrides.axesValue).toEqual([
      { padding: '4px 12px', '& span': { marginRight: '12px' } },
    ]);
    expect(theme.components.MuiChartsLegend?.styleOverrides?.root).toBeDefined();
  });
});
