import type { Theme } from '@mui/material/styles';
import { addRootOverride, getDensityScale, getDensitySizing } from '@mui/x-internals/densityTheme';

/** A theme whose `components` object the enhancer chain owns and can write into. */
export type DensityEnhancedTheme<T extends Theme> = T & {
  components: NonNullable<Theme['components']>;
};

/**
 * Make the date and time pickers density-aware on the scale the theme already
 * carries. Apply after `@mui/material`'s `unstable_enhanceDensity`; without it
 * the theme has no scale to read. Emits the community components only — the
 * Pro enhancer wraps this one and adds the range components.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  getDensityScale(theme);
  const components: NonNullable<Theme['components']> = { ...theme.components };
  const { spacing } = theme;
  const { touchTarget } = getDensitySizing(theme);

  // Day grid. A day is the interactive box; the 2px gutters around it are half
  // the smallest step, so a week row stays `touchTarget + xxSmall` high. The
  // weekday and week-number labels and the weeks container hardcode the same
  // master constants, so all of them move together or the grid tears.
  const dayGutter = `calc(${spacing('xxSmall')} / 2)`;
  const dayRow = `calc(${touchTarget} + ${spacing('xxSmall')})`;
  addRootOverride(components, 'MuiPickerDay', {
    '--PickerDay-size': touchTarget,
    '--PickerDay-horizontalMargin': dayGutter,
  });
  const dayLabel = { width: touchTarget, height: dayRow, marginInline: dayGutter };
  addRootOverride(components, 'MuiDayCalendar', dayLabel, 'weekDayLabel');
  addRootOverride(components, 'MuiDayCalendar', dayLabel, 'weekNumberLabel');
  addRootOverride(
    components,
    'MuiDayCalendar',
    { width: touchTarget, height: touchTarget, marginInline: dayGutter },
    'weekNumber',
  );
  addRootOverride(components, 'MuiDayCalendar', { marginBlock: dayGutter }, 'weekContainer');
  // Six week rows, the same product master computes from its day constants.
  const weeksHeight = { minHeight: `calc(${dayRow} * 6)` };
  addRootOverride(components, 'MuiDayCalendar', weeksHeight, 'slideTransition');
  addRootOverride(components, 'MuiDayCalendar', weeksHeight, 'loadingContainer');

  // The calendar view is the header block plus seven rows (weekday labels and
  // six weeks), the sum master hardcodes as its view height (336 = 56 + 7 * 40).
  // The date time picker caps its clock columns at that constant with
  // `maxHeight`, so a shorter calendar leaves that row at the clock height.
  const headerBlock = `${spacing('small')} + ${touchTarget} + ${spacing('xxSmall')}`;
  addRootOverride(components, 'MuiDateCalendar', {
    height: `calc(${headerBlock} + ${dayRow} * 7)`,
  });

  // Calendar header: the bar is as high as its arrow buttons.
  addRootOverride(components, 'MuiPickersCalendarHeader', {
    minHeight: touchTarget,
    maxHeight: touchTarget,
    marginTop: spacing('small'),
    marginBottom: spacing('xxSmall'),
    paddingLeft: spacing('large'),
    paddingRight: spacing('small'),
  });
  addRootOverride(
    components,
    'MuiPickersCalendarHeader',
    { marginRight: spacing('xSmall') },
    'label',
  );
  addRootOverride(components, 'MuiPickersArrowSwitcher', { width: spacing('large') }, 'spacer');

  // Month and year grids: pill buttons twice as wide as they are high.
  const pill = {
    height: touchTarget,
    width: `calc(${touchTarget} * 2)`,
    borderRadius: `calc(${touchTarget} / 2)`,
  };
  addRootOverride(components, 'MuiMonthCalendar', {
    rowGap: spacing('medium'),
    paddingBlock: spacing('xSmall'),
    variants: [{ props: { monthsPerRow: 3 }, style: { columnGap: spacing('large') } }],
  });
  addRootOverride(components, 'MuiMonthCalendar', pill, 'button');
  // The four-per-row variant resets the block padding after the base rule, so
  // the block inset is scoped to the three-per-row layout.
  addRootOverride(components, 'MuiYearCalendar', {
    rowGap: spacing('small'),
    // The year list fills the calendar view below the header (280 = 7 * 40).
    maxHeight: `calc(${dayRow} * 7)`,
    variants: [
      {
        props: { yearsPerRow: 3 },
        style: { columnGap: spacing('large'), paddingBlock: spacing('xSmall') },
      },
      { props: { yearsPerRow: 4 }, style: { paddingInline: dayGutter } },
    ],
    // The fillers that complete the last row have a slot but no class key.
    '& > div:empty': { height: pill.height, width: pill.width },
  });
  addRootOverride(components, 'MuiYearCalendar', pill, 'button');

  return { ...theme, components };
}
