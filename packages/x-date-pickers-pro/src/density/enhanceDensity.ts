import type { Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-date-pickers/density';
import type { DensityEnhancedTheme } from '@mui/x-date-pickers/density';
import { dayCalendarClasses } from '@mui/x-date-pickers/DateCalendar';
import { pickersArrowSwitcherClasses, pickersToolbarClasses } from '@mui/x-date-pickers/internals';
import { addStyleOverride, getDensitySizing } from '@mui/x-internals/densityTheme';

/**
 * Make the Pro date and time pickers density-aware: the community enhancer
 * first, then the range components on top. Each tier emits only what it owns.
 *
 * The community enhancer returns a fresh theme with a fresh `components`
 * object, so this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceCommunityDensity(theme);
  const { spacing } = theme;
  const { touchTarget } = getDensitySizing(theme);
  const { components } = enhanced;

  // Range days use the same box and gutters as the community day; the range
  // highlight and preview pseudo-elements read the two vars, so they follow.
  const dayGutter = `calc(${spacing('xxSmall')} / 2)`;
  const dayRow = `calc(${touchTarget} + ${spacing('xxSmall')})`;
  addStyleOverride(components, 'MuiDateRangePickerDay', 'root', {
    '--PickerDay-size': touchTarget,
    '--PickerDay-horizontalMargin': dayGutter,
  });

  // Each month column wraps an internal DayCalendar (six weeks high) and, with
  // several calendars, an internal arrow switcher header. Neither has a theme
  // key of its own, so both nest under the column; the child combinator
  // outranks the switcher's own class, which is injected later.
  addStyleOverride(components, 'MuiDateRangeCalendar', 'monthContainer', {
    [`& .${dayCalendarClasses.root}`]: { minHeight: `calc(${dayRow} * 6)` },
    [`& > .${pickersArrowSwitcherClasses.root}`]: {
      padding: `${spacing('small')} ${spacing('medium')} ${spacing('xxSmall')}`,
    },
  });

  // Tab strips. The date time range strip holds a large Button between two
  // navigation IconButtons, so it is as high as material's large box; the
  // filler stands in for a hidden IconButton. The time range tabs are
  // material Tabs, so they take material's tab height.
  addStyleOverride(components, 'MuiDateTimeRangePickerTabs', 'root', {
    minHeight: `calc(${touchTarget} + ${spacing('small')})`,
  });
  addStyleOverride(components, 'MuiDateTimeRangePickerTabs', 'filler', { width: touchTarget });
  addStyleOverride(components, 'MuiTimeRangePickerTabs', 'tab', {
    minHeight: touchTarget,
    gap: spacing('xSmall'),
  });

  addStyleOverride(components, 'MuiTimeRangePickerToolbar', 'root', {
    paddingTop: spacing('small'),
    paddingBottom: spacing('xSmall'),
    [`& .${pickersToolbarClasses.title}`]: { paddingLeft: spacing('small') },
  });
  addStyleOverride(components, 'MuiTimeRangePickerToolbar', 'container', {
    variants: [{ props: { pickerVariant: 'mobile' }, style: { rowGap: spacing('xSmall') } }],
  });

  return enhanced;
}
