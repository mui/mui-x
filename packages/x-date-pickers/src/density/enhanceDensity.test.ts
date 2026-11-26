import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

// Built through material's own enhancer: it writes the
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
      {
        height: 'calc(12px + 32px + 4px + calc(32px + 4px) * 7)',
        maxHeight: 'none',
        width: 'max(320px, calc(calc(32px + 4px) * 7 + 2 * 24px))',
      },
    ]);
  });

  it('gives the month and year grids the width of the day view', () => {
    const theme = enhanceDensity(enhancedTheme());
    const width = 'max(320px, calc(calc(32px + 4px) * 7 + 2 * 24px))';
    const [month] = theme.components.MuiMonthCalendar?.styleOverrides?.root as any[];
    const [year] = theme.components.MuiYearCalendar?.styleOverrides?.root as any[];
    expect(month.width).toBe(width);
    expect(year.width).toBe(width);
  });

  it('scopes the year grid block inset to the three-per-row layout', () => {
    const theme = enhanceDensity(enhancedTheme());
    const [root] = theme.components.MuiYearCalendar?.styleOverrides?.root as any[];
    expect(root.variants).toEqual([
      { props: { yearsPerRow: 3 }, style: { columnGap: '24px', paddingBlock: '8px' } },
      { props: { yearsPerRow: 4 }, style: { paddingInline: 'calc(4px / 2)' } },
    ]);
  });

  it('puts the clock list items on the touch target with no block padding', () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(theme.components.MuiDigitalClock?.styleOverrides?.item).toEqual([
      {
        minHeight: '32px',
        paddingBlock: 0,
        marginBlock: 'calc(4px / 2)',
        marginInline: '4px',
        paddingInline: '16px',
        '&:first-of-type': { marginTop: 4 },
      },
    ]);
    expect(theme.components.MuiDigitalClock?.styleOverrides?.list).toEqual([{ padding: 0 }]);
    expect(theme.components.MuiMultiSectionDigitalClockSection?.styleOverrides?.root).toEqual([
      { padding: 0 },
    ]);
  });

  it("releases material's Button min height on the toolbar value buttons", () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(theme.components.MuiPickersToolbarButton?.styleOverrides?.root).toEqual([
      { minHeight: 0, padding: 0, textTransform: 'none' },
    ]);
  });

  it("zeroes material's dialog content inset around a picker layout", () => {
    const theme = enhanceDensity(enhancedTheme());
    const [pickerLayer] = theme.components.MuiDialogContent?.styleOverrides?.root as any[];
    expect(pickerLayer).toEqual({ '&:has(> .MuiPickersLayout-root)': { padding: 0 } });
  });

  it("keeps the clock and layout controls at material's spacing", () => {
    const { components } = enhanceDensity(enhancedTheme());
    const meridiemButton = { minWidth: 0, minHeight: 0, height: 36, paddingInline: 4 };
    expect(components.MuiClock?.styleOverrides?.amButton).toEqual([meridiemButton]);
    expect(components.MuiClock?.styleOverrides?.pmButton).toEqual([meridiemButton]);
    expect(components.MuiPickersLayout?.styleOverrides?.actionBar).toEqual([
      { padding: '8px', gap: '8px' },
    ]);
    const viewHeight = 'calc(12px + 32px + 4px + calc(32px + 4px) * 7)';
    expect(components.MuiPickersLayout?.styleOverrides?.root).toEqual([
      {
        '&:has(.MuiDateCalendar-root)': {
          '& .MuiMultiSectionDigitalClock-root, & .MuiMultiSectionDigitalClockSection-root, & .MuiDigitalClock-root':
            { maxHeight: viewHeight },
          '& .MuiPickersLayout-shortcuts': { maxHeight: viewHeight },
        },
        '&:has(.MuiDateTimePickerTabs-root)': {
          '& .MuiMultiSectionDigitalClock-root': {
            width: 'max(320px, calc(calc(32px + 4px) * 7 + 2 * 24px))',
            maxHeight: viewHeight,
          },
          '& .MuiMultiSectionDigitalClockSection-root': { maxHeight: `calc(${viewHeight} - 1px)` },
        },
      },
    ]);
    expect(components.MuiPickersArrowSwitcher?.styleOverrides?.spacer).toEqual([
      { width: 'calc(32px - 16px)' },
    ]);
  });

  it('spaces and sizes the field adornments like a material input', () => {
    const { components } = enhanceDensity(enhancedTheme());
    const smallBox = 'calc(32px - 4px)';
    const pull = `calc((16px - ${smallBox}) / 2)`;
    expect(components.MuiPickersInputBase?.styleOverrides?.root).toEqual([
      {
        gap: '8px',
        variants: [
          {
            props: { inputSize: 'small' },
            style: {
              gap: '4px',
              '& .MuiInputAdornment-root .MuiIconButton-sizeMedium': {
                minWidth: smallBox,
                minHeight: smallBox,
                '&.MuiIconButton-edgeEnd': { marginRight: pull },
                '&.MuiIconButton-edgeStart': { marginLeft: pull },
              },
            },
          },
        ],
      },
    ]);
    const [filled] = components.MuiPickersFilledInput?.styleOverrides?.root as any[];
    expect(filled['--_filledInputPadTop']).toBe('calc(16px + (32px - 1lh) / 2)');
    expect(filled['--_filledInputPadBottom']).toBe('calc((32px - 1lh) / 2)');
  });

  it("writes the label variables material's InputLabel reads for the picker inputs", () => {
    const theme = enhanceDensity(enhancedTheme());
    const [outlined] = theme.components.MuiPickersOutlinedInput?.styleOverrides?.root as any[];
    expect(outlined['.MuiInputLabel-root:has(~ &)']).toEqual({
      '--_restY': 'calc((32px - 1lh) / 2)',
      '--_inlinePad': '12px',
    });
    const [filled] = theme.components.MuiPickersFilledInput?.styleOverrides?.root as any[];
    expect(filled['.MuiInputLabel-root:has(~ &)']).toEqual({
      '--_restY': 'calc((calc(16px + (32px - 1lh) / 2) + calc((32px - 1lh) / 2)) / 2)',
      '--_shrinkY': '6px',
      '--_inlinePad': '12px',
    });
    const [standard] = theme.components.MuiPickersInput?.styleOverrides?.root as any[];
    expect(standard['label + &']).toEqual({ marginTop: '12px' });
  });

  it('mirrors the inline label offset on a right-to-left theme', () => {
    const theme = enhanceDensity(enhancedTheme({}, { direction: 'rtl' }));
    const [outlined] = theme.components.MuiPickersOutlinedInput?.styleOverrides?.root as any[];
    expect(outlined['.MuiInputLabel-root:has(~ &)']['--_inlinePad']).toBe('calc(-1 * 12px)');
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
