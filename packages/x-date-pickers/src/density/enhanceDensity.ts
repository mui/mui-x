import type { Theme } from '@mui/material/styles';
import { inputLabelClasses } from '@mui/material/InputLabel';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { iconButtonClasses } from '@mui/material/IconButton';
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

  // Clock lists: their items are MenuItems, so they ride material's actionable
  // row (`touchTarget` high, no block padding) with the list's own inline inset.
  // The 2px item gutters are half a step, as on the day grid. The first item's
  // extra 4px top margin is subtracted as a literal by the digital clock's
  // scroll code, so it is left alone there.
  const clockItem = {
    minHeight: touchTarget,
    paddingBlock: 0,
    marginBlock: dayGutter,
    marginInline: spacing('xxSmall'),
  };
  addRootOverride(
    components,
    'MuiDigitalClock',
    { ...clockItem, paddingInline: spacing('medium') },
    'item',
  );
  addRootOverride(
    components,
    'MuiMultiSectionDigitalClockSection',
    {
      ...clockItem,
      paddingInline: spacing('xSmall'),
      '&:first-of-type': { marginTop: spacing('xxSmall') },
    },
    'item',
  );
  addRootOverride(components, 'MuiClock', { margin: spacing('medium') });

  // Toolbars. The landscape padding resets the portrait one after the base
  // rule, so it is restated in the same variant.
  addRootOverride(components, 'MuiPickersToolbar', {
    padding: `${spacing('medium')} ${spacing('large')}`,
    variants: [
      { props: { pickerOrientation: 'landscape' }, style: { padding: spacing('medium') } },
    ],
  });
  // The toolbar values are Buttons holding headline text. Material's enhancer
  // gives every medium Button a `touchTarget` height, which clips the headline
  // and drops it below the separators, so the height is released again.
  addRootOverride(components, 'MuiPickersToolbarButton', { height: 'auto' });
  addRootOverride(
    components,
    'MuiDatePickerToolbar',
    {
      variants: [
        { props: { pickerOrientation: 'landscape' }, style: { marginRight: spacing('medium') } },
      ],
    },
    'title',
  );
  const toolbarSeparator = { marginLeft: dayGutter, marginRight: spacing('xxSmall') };
  // The landscape am/pm block resets the inline margins after the base rule.
  const ampmSelection = {
    marginLeft: spacing('small'),
    variants: [
      {
        props: { pickerOrientation: 'landscape' },
        style: { marginTop: spacing('xxSmall'), marginLeft: 0 },
      },
    ],
  };
  addRootOverride(components, 'MuiTimePickerToolbar', toolbarSeparator, 'separator');
  addRootOverride(components, 'MuiTimePickerToolbar', ampmSelection, 'ampmSelection');
  addRootOverride(components, 'MuiDateTimePickerToolbar', {
    paddingInline: spacing('medium'),
    variants: [
      {
        props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
        style: { paddingLeft: spacing('large'), paddingRight: 0 },
      },
    ],
  });
  addRootOverride(
    components,
    'MuiDateTimePickerToolbar',
    {
      variants: [
        {
          props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
          style: { gap: spacing('xSmall'), marginRight: spacing('xxSmall') },
        },
      ],
    },
    'timeContainer',
  );
  addRootOverride(
    components,
    'MuiDateTimePickerToolbar',
    { variants: [{ props: { toolbarVariant: 'mobile' }, style: toolbarSeparator }] },
    'separator',
  );
  addRootOverride(components, 'MuiDateTimePickerToolbar', ampmSelection, 'ampmSelection');

  // Fields. Material's enhancer places every form control label through
  // `--_restY` / `--_shrinkY` / `--_inlinePad`, read with no fallback, and only
  // its own inputs write them; the picker inputs write the same values for
  // their label, and size their sections container the way material sizes its
  // input element, so a picker field and a TextField of the same variant and
  // size line up.
  const padBlock = `calc((${touchTarget} - 1lh) / 2)`;
  const padBlockSmall = `calc((${touchTarget} - ${spacing('xxSmall')} - 1lh) / 2)`;
  const inlinePad = theme.direction === 'rtl' ? `calc(-1 * ${spacing('small')})` : spacing('small');
  const label = `.${inputLabelClasses.root}:has(~ &)`;
  // The open picker and clear buttons are medium IconButtons whatever the
  // field size; in master a medium button is exactly as high as a small field,
  // so the small field sizes its adornment buttons to material's small box.
  const smallBox = `calc(${touchTarget} - ${spacing('xxSmall')})`;
  addRootOverride(components, 'MuiPickersInputBase', {
    variants: [
      {
        props: { inputSize: 'small' },
        style: {
          [`& .${inputAdornmentClasses.root} .${iconButtonClasses.sizeMedium}`]: {
            width: smallBox,
            height: smallBox,
          },
        },
      },
    ],
  });
  addRootOverride(
    components,
    'MuiPickersInputBase',
    {
      paddingBlock: padBlock,
      variants: [{ props: { inputSize: 'small' }, style: { paddingBlock: padBlockSmall } }],
    },
    'sectionsContainer',
  );

  addRootOverride(components, 'MuiPickersOutlinedInput', {
    paddingInline: spacing('small'),
    [label]: { '--_restY': padBlock, '--_inlinePad': inlinePad },
    variants: [
      { props: { inputSize: 'small' }, style: { [label]: { '--_restY': padBlockSmall } } },
    ],
  });
  addRootOverride(
    components,
    'MuiPickersOutlinedInput',
    {
      paddingBlock: padBlock,
      variants: [{ props: { inputSize: 'small' }, style: { paddingBlock: padBlockSmall } }],
    },
    'sectionsContainer',
  );

  // Filled: the label takes `medium` above the value.
  const filledPadTop = `calc(${spacing('medium')} + (${touchTarget} - 1lh) / 2)`;
  const filledPadTopSmall = `calc(${spacing('medium')} + (${touchTarget} - 1lh) / 4)`;
  addRootOverride(components, 'MuiPickersFilledInput', {
    [label]: {
      '--_restY': `calc((${filledPadTop} + ${padBlock}) / 2)`,
      '--_shrinkY': '6px',
      '--_inlinePad': inlinePad,
    },
    variants: [
      {
        props: { inputSize: 'small' },
        style: {
          [label]: {
            '--_restY': `calc((${filledPadTopSmall} + ${padBlockSmall}) / 2)`,
            '--_shrinkY': '4px',
          },
        },
      },
      { props: { hasStartAdornment: true }, style: { paddingLeft: spacing('small') } },
      { props: { hasEndAdornment: true }, style: { paddingRight: spacing('small') } },
    ],
  });
  addRootOverride(
    components,
    'MuiPickersFilledInput',
    {
      paddingTop: filledPadTop,
      paddingBottom: padBlock,
      paddingInline: spacing('small'),
      variants: [
        {
          props: { inputSize: 'small' },
          style: { paddingTop: filledPadTopSmall, paddingBottom: padBlockSmall },
        },
        { props: { hasStartAdornment: true }, style: { paddingLeft: 0 } },
        { props: { hasEndAdornment: true }, style: { paddingRight: 0 } },
        { props: { hiddenLabel: true }, style: { paddingBlock: padBlock } },
        {
          props: { hiddenLabel: true, inputSize: 'small' },
          style: { paddingBlock: padBlockSmall },
        },
      ],
    },
    'sectionsContainer',
  );

  // Standard: the label sits in the margin above the underline.
  addRootOverride(components, 'MuiPickersInput', {
    'label + &': { marginTop: spacing('small') },
    [label]: { '--_restY': `calc(${spacing('small')} + ${padBlock})` },
    variants: [
      {
        props: { inputSize: 'small' },
        style: { [label]: { '--_restY': `calc(${spacing('small')} + ${padBlockSmall})` } },
      },
    ],
  });

  return { ...theme, components };
}
