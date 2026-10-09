import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

describe('enhanceDensity (premium)', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('applies the pro and community enhancers underneath', () => {
    const input = enhanceMaterial(createTheme());
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components?.MuiDataGrid?.defaultProps).toEqual({
      rowHeight: 40,
      columnHeaderHeight: 40,
      headerFilterHeight: 40,
    });
  });
});
