import type { Theme } from '@mui/material/styles';
import { inputLabelClasses } from '@mui/material/InputLabel';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { iconButtonClasses } from '@mui/material/IconButton';
import { addStyleOverride, getDensityScale, getDensitySizing } from '@mui/x-internals/densityTheme';
import { dateCalendarClasses } from '../DateCalendar';
import { dateTimePickerTabsClasses } from '../DateTimePicker';
import { digitalClockClasses } from '../DigitalClock';
import {
  multiSectionDigitalClockClasses,
  multiSectionDigitalClockSectionClasses,
} from '../MultiSectionDigitalClock';
import { pickersLayoutClasses } from '../PickersLayout';

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
  const { touchTarget, iconSize } = getDensitySizing(theme);

  // Day grid. A day is the interactive box; the 2px gutters around it are half
  // the smallest step, so a week row stays `touchTarget + xxSmall` high. The
  // weekday and week-number labels and the weeks container hardcode the same
  // master constants, so all of them move together or the grid tears.
  const dayGutter = `calc(${spacing('xxSmall')} / 2)`;
  const dayRow = `calc(${touchTarget} + ${spacing('xxSmall')})`;
  addStyleOverride(components, 'MuiPickerDay', 'root', {
    '--PickerDay-size': touchTarget,
    '--PickerDay-horizontalMargin': dayGutter,
  });
  const dayLabel = { width: touchTarget, height: dayRow, marginInline: dayGutter };
  addStyleOverride(components, 'MuiDayCalendar', 'weekDayLabel', dayLabel);
  addStyleOverride(components, 'MuiDayCalendar', 'weekNumberLabel', dayLabel);
  addStyleOverride(components, 'MuiDayCalendar', 'weekNumber', {
    width: touchTarget,
    height: touchTarget,
    marginInline: dayGutter,
  });
  addStyleOverride(components, 'MuiDayCalendar', 'weekContainer', { marginBlock: dayGutter });
  // Six week rows, the same product master computes from its day constants.
  const weeksHeight = { minHeight: `calc(${dayRow} * 6)` };
  addStyleOverride(components, 'MuiDayCalendar', 'slideTransition', weeksHeight);
  addStyleOverride(components, 'MuiDayCalendar', 'loadingContainer', weeksHeight);

  // The calendar view is the header block plus seven rows (weekday labels and
  // six weeks), the sum master hardcodes as its view height (336 = 56 + 7 * 40).
  // The date time picker caps its clock columns at that constant with
  // `maxHeight`, so a shorter calendar leaves that row at the clock height.
  const headerBlock = `${spacing('small')} + ${touchTarget} + ${spacing('xxSmall')}`;
  const viewHeight = `calc(${headerBlock} + ${dayRow} * 7)`;
  const viewWidth = `max(320px, calc(${dayRow} * 7 + 2 * ${spacing('large')}))`;
  addStyleOverride(components, 'MuiDateCalendar', 'root', {
    height: viewHeight,
    maxHeight: 'none',
    width: viewWidth,
  });

  // Calendar header: the bar is as high as its arrow buttons.
  addStyleOverride(components, 'MuiPickersCalendarHeader', 'root', {
    minHeight: touchTarget,
    maxHeight: touchTarget,
    marginTop: spacing('small'),
    marginBottom: spacing('xxSmall'),
    paddingLeft: spacing('large'),
    paddingRight: spacing('small'),
  });
  addStyleOverride(components, 'MuiPickersCalendarHeader', 'label', {
    marginRight: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiPickersArrowSwitcher', 'spacer', {
    width: `calc(${touchTarget} - ${iconSize})`,
  });

  // Month and year grids: pill buttons twice as wide as they are high.
  const pill = {
    height: touchTarget,
    width: `calc(${touchTarget} * 2)`,
    borderRadius: `calc(${touchTarget} / 2)`,
  };
  addStyleOverride(components, 'MuiMonthCalendar', 'root', {
    width: viewWidth,
    rowGap: spacing('medium'),
    paddingBlock: spacing('xSmall'),
    variants: [{ props: { monthsPerRow: 3 }, style: { columnGap: spacing('large') } }],
  });
  addStyleOverride(components, 'MuiMonthCalendar', 'button', pill);
  // The four-per-row variant resets the block padding after the base rule, so
  // the block inset is scoped to the three-per-row layout.
  addStyleOverride(components, 'MuiYearCalendar', 'root', {
    width: viewWidth,
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
  addStyleOverride(components, 'MuiYearCalendar', 'button', pill);

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
  addStyleOverride(components, 'MuiDigitalClock', 'item', {
    ...clockItem,
    paddingInline: spacing('medium'),
    '&:first-of-type': { marginTop: 4 },
  });
  addStyleOverride(components, 'MuiDigitalClock', 'list', { padding: 0 });
  addStyleOverride(components, 'MuiMultiSectionDigitalClockSection', 'root', { padding: 0 });
  addStyleOverride(components, 'MuiMultiSectionDigitalClockSection', 'item', {
    ...clockItem,
    paddingInline: spacing('xSmall'),
    '&:first-of-type': { marginTop: spacing('xxSmall') },
  });
  addStyleOverride(components, 'MuiClock', 'root', { margin: spacing('medium') });
  const meridiemButton = { minWidth: 0, minHeight: 0, height: 36, paddingInline: 4 };
  addStyleOverride(components, 'MuiClock', 'amButton', meridiemButton);
  addStyleOverride(components, 'MuiClock', 'pmButton', meridiemButton);
  addStyleOverride(components, 'MuiPickersLayout', 'root', {
    [`&:has(.${dateCalendarClasses.root})`]: {
      [`& .${multiSectionDigitalClockClasses.root}, & .${multiSectionDigitalClockSectionClasses.root}, & .${digitalClockClasses.root}`]:
        { maxHeight: viewHeight },
      [`& .${pickersLayoutClasses.shortcuts}`]: { maxHeight: viewHeight },
    },
    [`&:has(.${dateTimePickerTabsClasses.root})`]: {
      [`& .${multiSectionDigitalClockClasses.root}`]: { width: viewWidth, maxHeight: viewHeight },
      [`& .${multiSectionDigitalClockSectionClasses.root}`]: {
        maxHeight: `calc(${viewHeight} - 1px)`,
      },
    },
  });
  addStyleOverride(components, 'MuiPickersLayout', 'actionBar', {
    padding: spacing('xSmall'),
    gap: spacing('xSmall'),
  });

  // Toolbars. The landscape padding resets the portrait one after the base
  // rule, so it is restated in the same variant.
  addStyleOverride(components, 'MuiDialogContent', 'root', {
    [`&:has(> .${pickersLayoutClasses.root})`]: { padding: 0 },
  });
  addStyleOverride(components, 'MuiPickersToolbar', 'root', {
    padding: `${spacing('medium')} ${spacing('large')}`,
    variants: [
      { props: { pickerOrientation: 'landscape' }, style: { padding: spacing('medium') } },
    ],
  });
  addStyleOverride(components, 'MuiPickersToolbarButton', 'root', {
    minHeight: 0,
    padding: 0,
    textTransform: 'none',
  });
  addStyleOverride(components, 'MuiDatePickerToolbar', 'title', {
    variants: [
      { props: { pickerOrientation: 'landscape' }, style: { marginRight: spacing('medium') } },
    ],
  });
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
  addStyleOverride(components, 'MuiTimePickerToolbar', 'separator', toolbarSeparator);
  addStyleOverride(components, 'MuiTimePickerToolbar', 'ampmSelection', ampmSelection);
  addStyleOverride(components, 'MuiDateTimePickerToolbar', 'root', {
    paddingInline: spacing('medium'),
    variants: [
      {
        props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
        style: { paddingLeft: spacing('large'), paddingRight: 0 },
      },
    ],
  });
  addStyleOverride(components, 'MuiDateTimePickerToolbar', 'timeContainer', {
    variants: [
      {
        props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
        style: { gap: spacing('xSmall'), marginRight: spacing('xxSmall') },
      },
    ],
  });
  addStyleOverride(components, 'MuiDateTimePickerToolbar', 'separator', {
    variants: [{ props: { toolbarVariant: 'mobile' }, style: toolbarSeparator }],
  });
  addStyleOverride(components, 'MuiDateTimePickerToolbar', 'ampmSelection', ampmSelection);

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
  const smallEdgePull = `calc((${iconSize} - ${smallBox}) / 2)`;
  addStyleOverride(components, 'MuiPickersInputBase', 'root', {
    gap: spacing('xSmall'),
    variants: [
      {
        props: { inputSize: 'small' },
        style: {
          gap: spacing('xxSmall'),
          [`& .${inputAdornmentClasses.root} .${iconButtonClasses.sizeMedium}`]: {
            minWidth: smallBox,
            minHeight: smallBox,
            [`&.${iconButtonClasses.edgeEnd}`]: { marginRight: smallEdgePull },
            [`&.${iconButtonClasses.edgeStart}`]: { marginLeft: smallEdgePull },
          },
        },
      },
    ],
  });
  addStyleOverride(components, 'MuiPickersInputBase', 'sectionsContainer', {
    paddingBlock: padBlock,
    variants: [{ props: { inputSize: 'small' }, style: { paddingBlock: padBlockSmall } }],
  });

  addStyleOverride(components, 'MuiPickersOutlinedInput', 'root', {
    paddingInline: spacing('small'),
    [label]: { '--_restY': padBlock, '--_inlinePad': inlinePad },
    variants: [
      { props: { inputSize: 'small' }, style: { [label]: { '--_restY': padBlockSmall } } },
    ],
  });
  addStyleOverride(components, 'MuiPickersOutlinedInput', 'sectionsContainer', {
    paddingBlock: padBlock,
    variants: [{ props: { inputSize: 'small' }, style: { paddingBlock: padBlockSmall } }],
  });

  // Filled: the label takes `medium` above the value.
  const filledPadTop = `calc(${spacing('medium')} + (${touchTarget} - 1lh) / 2)`;
  const filledPadTopSmall = `calc(${spacing('medium')} + (${touchTarget} - 1lh) / 4)`;
  addStyleOverride(components, 'MuiPickersFilledInput', 'root', {
    '--_filledInputPadTop': filledPadTop,
    '--_filledInputPadBottom': padBlock,
    [label]: {
      '--_restY': `calc((${filledPadTop} + ${padBlock}) / 2)`,
      '--_shrinkY': '6px',
      '--_inlinePad': inlinePad,
    },
    variants: [
      {
        props: { inputSize: 'small' },
        style: {
          '--_filledInputPadTop': filledPadTopSmall,
          '--_filledInputPadBottom': padBlockSmall,
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
  addStyleOverride(components, 'MuiPickersFilledInput', 'sectionsContainer', {
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
  });

  // Standard: the label sits in the margin above the underline.
  addStyleOverride(components, 'MuiPickersInput', 'root', {
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
