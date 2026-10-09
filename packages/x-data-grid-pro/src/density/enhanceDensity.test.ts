import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

const enhancedTheme = (components = {}) => enhanceMaterial(createTheme({ components }));

describe('enhanceDensity (pro)', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('adds the header filter height on top of the community heights', () => {
    const input = enhancedTheme();
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 40,
      columnHeaderHeight: 40,
      headerFilterHeight: 40,
    });
  });

  it("lets the theme's own headerFilterHeight win", () => {
    const theme = enhanceDensity(
      enhancedTheme({ MuiDataGrid: { defaultProps: { headerFilterHeight: 36 } } }),
    );
    expect(theme.components?.MuiDataGrid?.defaultProps?.headerFilterHeight).toBe(36);
  });
});
