import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

const enhancedTheme = (components = {}, options = {}) =>
  enhanceMaterial(createTheme({ components, ...options }));

describe('enhanceDensity', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('applies the community enhancer underneath', () => {
    const input = enhancedTheme();
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components.MuiPickerDay?.styleOverrides?.root).toEqual([
      { '--PickerDay-size': '32px', '--PickerDay-horizontalMargin': 'calc(4px / 2)' },
    ]);
  });

  it('sizes the range day like the community day', () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(theme.components.MuiDateRangePickerDay?.styleOverrides?.root).toEqual([
      { '--PickerDay-size': '32px', '--PickerDay-horizontalMargin': 'calc(4px / 2)' },
    ]);
  });

  it('nests the internal month header and day calendar under the month column', () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(theme.components.MuiDateRangeCalendar?.styleOverrides?.monthContainer).toEqual([
      {
        '& .MuiDayCalendar-root': { minHeight: 'calc(calc(32px + 4px) * 6)' },
        '& > .MuiPickersArrowSwitcher-root': { padding: '12px 16px 4px' },
      },
    ]);
  });
});
