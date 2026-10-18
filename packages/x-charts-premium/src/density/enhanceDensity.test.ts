import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import type { ChartsDensityComponents } from '@mui/x-charts/density';
import { enhanceDensity } from './enhanceDensity';

describe('enhanceDensity', () => {
  it('sizes the palette option swatch to the glyph, on top of the Pro emissions', () => {
    const theme = enhanceDensity(enhanceMaterial(createTheme()));
    const grid = (theme.components as any).MuiDataGrid.styleOverrides;
    expect(grid.paletteOptionRoot).toEqual([{ gap: '8px' }]);
    expect(grid.paletteOptionIcon).toEqual([{ width: '16px', height: '16px' }]);
    expect(
      (theme.components as ChartsDensityComponents).MuiChartsToolbar?.styleOverrides?.divider,
    ).toBeDefined();
  });
});
