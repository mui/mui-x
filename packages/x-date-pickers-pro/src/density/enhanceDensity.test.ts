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
        '& .MuiDayCalendar-slideTransition': { minHeight: 'calc(calc(32px + 4px) * 6)' },
        '& > .MuiPickersArrowSwitcher-root': { padding: '12px 16px 4px' },
      },
    ]);
    const [rangeLayout] = theme.components.MuiPickersLayout?.styleOverrides?.root as any[];
    expect(rangeLayout).toEqual({
      '&:has(.MuiDateRangeCalendar-root)': {
        '& .MuiMultiSectionDigitalClock-root, & .MuiMultiSectionDigitalClockSection-root, & .MuiDigitalClock-root':
          { maxHeight: 'max(360px, calc(12px + 32px + 4px + calc(32px + 4px) * 7))' },
      },
    });
  });

  it('restates the range toolbar and tab values the theme layer would override', () => {
    const { components } = enhanceDensity(enhancedTheme());
    expect(components.MuiDateTimeRangePickerToolbar?.styleOverrides?.startToolbar).toEqual([
      { paddingBottom: 0 },
    ]);
    expect(components.MuiDateTimeRangePickerTabs?.styleOverrides?.tabButton).toEqual([
      { textTransform: 'none' },
    ]);
    expect(components.MuiTimeRangePickerToolbar?.styleOverrides?.root).toEqual([
      {
        paddingTop: '12px',
        paddingBottom: '8px',
        paddingInline: 0,
        '& .MuiPickersToolbar-title': { paddingLeft: '12px' },
      },
    ]);
  });

  it('spaces the multi-input range fields by the medium step, a theme spacing winning', () => {
    const theme = enhanceDensity(
      enhanceMaterial(
        createTheme({
          components: { MuiMultiInputTimeRangeField: { defaultProps: { spacing: 1 } } },
        }),
      ),
    );
    expect(theme.components.MuiMultiInputDateRangeField?.defaultProps).toEqual({ spacing: '16px' });
    expect(theme.components.MuiMultiInputDateTimeRangeField?.defaultProps).toEqual({
      spacing: '16px',
    });
    expect(theme.components.MuiMultiInputTimeRangeField?.defaultProps).toEqual({ spacing: 1 });
  });
});
