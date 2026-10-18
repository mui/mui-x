import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

// Built through material's own enhancer (the pinned PR build): it writes the
// `unstable_densityScale` contract and installs the keyed `theme.spacing`.
const enhancedTheme = (components = {}, options = {}) =>
  enhanceMaterial(createTheme({ components, ...options }));

describe('enhanceDensity', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('sizes the day off the touch target with half-step gutters', () => {
    const plain = enhanceDensity(enhancedTheme());
    expect(plain.components.MuiPickerDay?.styleOverrides?.root).toEqual([
      { '--PickerDay-size': '32px', '--PickerDay-horizontalMargin': 'calc(4px / 2)' },
    ]);

    const vars = enhanceDensity(enhancedTheme({}, { cssVariables: true }));
    expect(vars.components.MuiPickerDay?.styleOverrides?.root).toEqual([
      {
        '--PickerDay-size': 'var(--mui-touchTarget, 32px)',
        '--PickerDay-horizontalMargin': 'calc(var(--mui-spacing-xxSmall, 4px) / 2)',
      },
    ]);
  });

  it('moves the weekday labels, the weeks container and the view height with the day', () => {
    const theme = enhanceDensity(enhancedTheme());
    const dayCalendar = theme.components.MuiDayCalendar?.styleOverrides;
    expect(dayCalendar?.weekDayLabel).toEqual([
      { width: '32px', height: 'calc(32px + 4px)', marginInline: 'calc(4px / 2)' },
    ]);
    expect(dayCalendar?.slideTransition).toEqual([{ minHeight: 'calc(calc(32px + 4px) * 6)' }]);
    expect(theme.components.MuiDateCalendar?.styleOverrides?.root).toEqual([
      { height: 'calc(12px + 32px + 4px + calc(32px + 4px) * 7)' },
    ]);
  });

  it('scopes the year grid block inset to the three-per-row layout', () => {
    const theme = enhanceDensity(enhancedTheme());
    const [root] = theme.components.MuiYearCalendar?.styleOverrides?.root as any[];
    expect(root.variants).toEqual([
      { props: { yearsPerRow: 3 }, style: { columnGap: '24px', paddingBlock: '8px' } },
      { props: { yearsPerRow: 4 }, style: { paddingInline: 'calc(4px / 2)' } },
    ]);
  });

  it("keeps the theme's own overrides as the last layer", () => {
    const own = { '--PickerDay-size': '40px' };
    const theme = enhanceDensity(
      enhancedTheme({ MuiPickerDay: { styleOverrides: { root: own } } }),
    );
    const root = theme.components.MuiPickerDay?.styleOverrides?.root as any[];
    expect(root[1]).toEqual(own);
  });

  it('does not mutate the input theme', () => {
    const input = enhancedTheme();
    const before = JSON.stringify(input.components);
    const output = enhanceDensity(input);
    expect(output).not.toBe(input);
    expect(JSON.stringify(input.components)).toBe(before);
  });
});
