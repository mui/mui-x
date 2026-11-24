import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';
import type { ChartsDensityComponents } from './enhanceDensity';

const enhancedTheme = (components = {}, options = {}) =>
  enhanceMaterial(createTheme({ components, ...options }));

describe('enhanceDensity', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('maps the legend spacing to the same-size steps, var refs on a vars theme', () => {
    const theme = enhanceDensity(enhancedTheme({}, { cssVariables: true }));
    expect(theme.components.MuiChartsLegend?.styleOverrides?.root).toEqual([
      {
        marginBlock: 'var(--mui-spacing-xSmall, 8px)',
        marginInline: 'var(--mui-spacing-xSmall, 8px)',
        gap: 'var(--mui-spacing-medium, 16px)',
        '& .MuiChartsLegend-series': { gap: 'var(--mui-spacing-xSmall, 8px)' },
      },
    ]);
  });

  it('steps the legend marks off the glyph size', () => {
    const theme = enhanceDensity(enhancedTheme());
    const [mark] = (theme.components as ChartsDensityComponents).MuiChartsLabelMark?.styleOverrides
      ?.root as any[];
    expect(mark.width).toBe('calc(16px - 2px)');
    expect(mark['&.MuiChartsLabelMark-line']).toEqual({ width: '16px', height: 'calc(16px / 2)' });
  });

  it('sizes the toolbar bar off the touch target', () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(
      (theme.components as ChartsDensityComponents).MuiChartsToolbar?.styleOverrides?.root,
    ).toEqual([
      {
        gap: 'calc(4px / 2)',
        padding: '4px',
        marginBottom: '12px',
        minHeight: 'calc(32px + 2 * 4px)',
      },
    ]);
  });

  it('does not mutate the input theme', () => {
    const input = enhancedTheme();
    const before = JSON.stringify(input.components);
    const output = enhanceDensity(input);
    expect(output).not.toBe(input);
    expect(JSON.stringify(input.components)).toBe(before);
  });
});
