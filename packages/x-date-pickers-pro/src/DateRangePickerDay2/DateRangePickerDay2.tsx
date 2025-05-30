import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha, styled, useThemeProps, CSSInterpolation, Theme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { usePickerDayOwnerState, useUtils } from '@mui/x-date-pickers/internals';
import {
  DateRangePickerDay2OwnerState,
  DateRangePickerDay2Props,
} from './DateRangePickerDay2.types';
import {
  DateRangePickerDay2Classes,
  dateRangePickerDay2Classes,
  DateRangePickerDay2ClassKey,
  getDateRangePickerDay2UtilityClass,
} from './dateRangePickerDay2Classes';

const useUtilityClasses = (
  ownerState: DateRangePickerDay2OwnerState,
  classes?: Partial<DateRangePickerDay2Classes>,
) => {
  const {
    isDaySelected,
    disableHighlightToday,
    isDayCurrent,
    isDayDisabled,
    isDayOutsideMonth,
    isDayFillerCell,
    isDayPreviewStart,
    isDayPreviewEnd,
    isDayInsidePreview,
    isDayPreviewed,
    isDaySelectionStart,
    isDaySelectionEnd,
    isDayInsideSelection,
    isDayStartOfWeek,
    isDayEndOfWeek,
    isDayStartOfMonth,
    isDayEndOfMonth,
    isDayDraggable,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isDayDisabled && 'disabled',
      !disableHighlightToday && isDayCurrent && !isDaySelected && !isDayFillerCell && 'today',
      isDayOutsideMonth && 'dayOutsideMonth',
      isDayFillerCell && 'fillerCell',
      isDaySelected && 'selected',
      isDayPreviewStart && 'previewStart',
      isDayPreviewEnd && 'previewEnd',
      isDayInsidePreview && 'insidePreviewing',
      isDaySelectionStart && 'selectionStart',
      isDaySelectionEnd && 'selectionEnd',
      isDayInsideSelection && 'insideSelection',
      isDayEndOfWeek && 'endOfWeek',
      isDayStartOfWeek && 'startOfWeek',
      isDayPreviewed && 'previewed',
      isDayStartOfMonth && 'startOfMonth',
      isDayEndOfMonth && 'endOfMonth',
      isDayDraggable && 'draggable',
    ],
  };

  return composeClasses(slots, getDateRangePickerDay2UtilityClass, classes);
};

const highlightStyles = (theme: Theme) => ({
  content: '""' /* Creates an empty element */,
  height: '100%',
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
    : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
  boxSizing: 'border-box',
  left: 'calc(var(--PickerDay-horizontalMargin) * (-1))',
  right: 'calc(var(--PickerDay-horizontalMargin) * (-1))',
});
const previewStyles = (theme: Theme) => ({
  content: '""' /* Creates an empty element */,
  height: '100%',
  border: `1.2px dashed ${(theme.vars || theme).palette.divider}`,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  boxSizing: 'border-box',
  borderOffset: '-1px',
  left: 'calc(-1 * var(--PickerDay-horizontalMargin))',
  right: 'calc(-1 * var(--PickerDay-horizontalMargin))',
});

const selectedDayStyles = (theme: Theme) => ({
  color: (theme.vars || theme).palette.primary.contrastText,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  fontWeight: theme.typography.fontWeightMedium,
  '&:focus, &:hover': {
    willChange: 'background-color',
    backgroundColor: (theme.vars || theme).palette.primary.dark,
  },
  [`&.${dateRangePickerDay2Classes.disabled}`]: {
    opacity: 0.6,
  },
});

const DateRangePickerDay2Root = styled(ButtonBase, {
  name: 'MuiDateRangePickerDay2',
  slot: 'Root',
  overridesResolver: (
    props: { ownerState: DateRangePickerDay2OwnerState },
    styles: Record<DateRangePickerDay2ClassKey, CSSInterpolation>,
  ) => {
    const { ownerState } = props;
    return [
      styles.root,
      !ownerState.disableHighlightToday && ownerState.isDayCurrent && styles.today,
      !ownerState.isDayOutsideMonth && styles.dayOutsideMonth,
      ownerState.isDayFillerCell && styles.fillerCell,
      ownerState.isDaySelected && !ownerState.isDayInsideSelection && styles.selected,
      ownerState.isDayPreviewStart && styles.previewStart,
      ownerState.isDayPreviewEnd && styles.previewEnd,
      ownerState.isDayInsidePreview && styles.insidePreviewing,
      ownerState.isDaySelectionStart && styles.selectionStart,
      ownerState.isDaySelectionEnd && styles.selectionEnd,
      ownerState.isDayInsideSelection && styles.insideSelection,
      ownerState.isDayDraggable && styles.draggable,
      ownerState.isDayStartOfWeek && styles.startOfWeek,
      ownerState.isDayEndOfWeek && styles.endOfWeek,
    ];
  },
})<{ ownerState: DateRangePickerDay2OwnerState }>(({ theme }) => ({
  '--PickerDay-horizontalMargin': '2px',
  '--PickerDay-size': '36px',
  ...theme.typography.caption,
  width: 'var(--PickerDay-size)',
  height: 'var(--PickerDay-size)',
  borderRadius: '18px',
  padding: 0,
  position: 'relative',
  marginLeft: 'var(--PickerDay-horizontalMargin)',
  marginRight: 'var(--PickerDay-horizontalMargin)',
  // explicitly setting to `transparent` to avoid potentially getting impacted by change from the overridden component
  backgroundColor: 'transparent',
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short,
  }),
  color: (theme.vars || theme).palette.text.primary,
  '@media (pointer: fine)': {
    '&:hover': {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.hoverOpacity})`
        : alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
    },
  },
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
  },
  zIndex: 1,
  isolation: 'isolate',
  '&::before, &::after': {
    zIndex: -1,
    position: 'absolute',
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
  },
  variants: [
    {
      props: { isDayDisabled: true },
      style: {
        color: (theme.vars || theme).palette.text.disabled,
      },
    },
    {
      props: { isDayFillerCell: true },
      style: {
        // visibility: 'hidden' does not work here as it hides the element from screen readers
        // and results in unexpected relationships between week day and day columns.
        opacity: 0,
        pointerEvents: 'none',
      },
    },
    {
      props: { isDayOutsideMonth: true },
      style: {
        color: (theme.vars || theme).palette.text.secondary,
      },
    },
    {
      props: {
        isDayCurrent: true,
        isDaySelected: false,
      },
      style: {
        outline: `1px solid ${(theme.vars || theme).palette.text.secondary}`,
        outlineOffset: -1,
      },
    },
    {
      props: { isDayDraggable: true },
      style: {
        cursor: 'grab',
        touchAction: 'none',
      },
    },
    {
      props: { isDayPreviewStart: true },
      style: {
        '::after': {
          ...previewStyles(theme),
          borderTopLeftRadius: 'inherit',
          borderBottomLeftRadius: 'inherit',
          borderLeftColor: (theme.vars || theme).palette.divider,
          left: 0,
        },
      },
    },
    {
      props: { isDayPreviewEnd: true },
      style: {
        '::after': {
          ...previewStyles(theme),
          borderTopRightRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          borderRightColor: (theme.vars || theme).palette.divider,
          right: 0,
        },
      },
    },
    {
      props: { isDayInsidePreview: true },
      style: {
        '::after': {
          ...previewStyles(theme),
        },
      },
    },
    {
      props: { isDaySelectionStart: true },
      style: {
        '::before': {
          ...highlightStyles(theme),
          borderTopLeftRadius: 'inherit',
          borderBottomLeftRadius: 'inherit',
          left: 0,
        },
      },
    },
    {
      props: { isDaySelectionEnd: true },
      style: {
        '::before': {
          ...highlightStyles(theme),
          borderTopRightRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          right: 0,
        },
        '::after': {
          borderLeftColor: 'transparent',
        },
      },
    },
    {
      props: { isDayInsideSelection: true },
      color: 'initial',
      background: 'initial',
      style: {
        '::before': {
          ...highlightStyles(theme),
        },
      },
    },
    {
      props: { isDaySelected: true, isDayInsideSelection: false },
      style: {
        ...selectedDayStyles(theme),
      },
    },
    {
      props: { isDaySelectionStart: true, isDaySelectionEnd: true },
      style: {
        '::before': {
          left: 0,
          right: 0,
        },
      },
    },
    {
      props: {
        isDaySelectionStart: true,
        isDaySelectionEnd: true,
        isDayPreviewEnd: false,
        isDayPreviewStart: false,
      },
      style: {
        '::after': {
          left: 0,
          right: 0,
        },
      },
    },
    {
      props: {
        isDayPreviewEnd: true,
        isDayPreviewStart: true,
      },
      style: {
        '::after': {
          left: 0,
          right: 0,
        },
      },
    },
    {
      props: { isDayEndOfWeek: true },
      style: {
        '::after': {
          borderTopRightRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          borderRightColor: (theme.vars || theme).palette.divider,
          right: 0,
        },
        '::before': {
          borderTopRightRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          right: 0,
        },
      },
    },
    {
      props: {
        isDayStartOfWeek: true,
      },
      style: {
        '::after': {
          borderTopLeftRadius: 'inherit',
          borderBottomLeftRadius: 'inherit',
          borderLeftColor: (theme.vars || theme).palette.divider,
          left: 0,
        },
        '::before': {
          borderTopLeftRadius: 'inherit',
          borderBottomLeftRadius: 'inherit',
          left: 0,
        },
      },
    },
  ],
}));

type DateRangePickerDay2Component = ((
  props: DateRangePickerDay2Props & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const noop = () => {};

const DateRangePickerDay2Raw = React.forwardRef(function DateRangePickerDay2(
  inProps: DateRangePickerDay2Props,
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDateRangePickerDay2',
  });

  const utils = useUtils();

  const {
    autoFocus = false,
    className,
    classes: classesProp,
    hidden,
    isAnimating,
    onClick,
    onDaySelect,
    onFocus = noop,
    onBlur = noop,
    onKeyDown = noop,
    onMouseDown = noop,
    onMouseEnter = noop,
    children,
    isFirstVisibleCell,
    isLastVisibleCell,
    day,
    selected,
    disabled,
    today,
    outsideCurrentMonth,
    disableHighlightToday,
    showDaysOutsideCurrentMonth,
    isEndOfHighlighting,
    isEndOfPreviewing,
    isHighlighting,
    isPreviewing,
    isStartOfHighlighting,
    isStartOfPreviewing,
    isVisuallySelected,
    draggable,
    ...other
  } = props;

  const pickersDayOwnerState = usePickerDayOwnerState({
    day,
    selected,
    disabled,
    today,
    outsideCurrentMonth,
    disableMargin: false,
    disableHighlightToday,
    showDaysOutsideCurrentMonth,
  });

  const ownerState: DateRangePickerDay2OwnerState = {
    ...pickersDayOwnerState,
    // Properties that the Base UI implementation will have
    isDaySelectionStart: isStartOfHighlighting,
    isDaySelectionEnd: isEndOfHighlighting,
    isDayInsideSelection: isHighlighting && !isStartOfHighlighting && !isEndOfHighlighting,
    isDaySelected: isHighlighting || Boolean(selected),
    isDayPreviewed: isPreviewing,
    isDayPreviewStart: isStartOfPreviewing,
    isDayPreviewEnd: isEndOfPreviewing,
    isDayInsidePreview: isPreviewing && !isStartOfPreviewing && !isEndOfPreviewing,
    // Properties specific to the MUI implementation (some might be removed in the next major)
    isDayStartOfMonth: utils.isSameDay(day, utils.startOfMonth(day)),
    isDayEndOfMonth: utils.isSameDay(day, utils.endOfMonth(day)),
    isDayFirstVisibleCell: isFirstVisibleCell,
    isDayLastVisibleCell: isLastVisibleCell,
    isDayFillerCell: outsideCurrentMonth && !showDaysOutsideCurrentMonth,
    isDayDraggable: Boolean(draggable),
  };

  const classes = useUtilityClasses(ownerState, classesProp);

  const ref = React.useRef<HTMLButtonElement>(null);
  const handleRef = useForkRef(ref, forwardedRef);

  // Since this is rendered when a Popper is opened we can't use passive effects.
  // Focusing in passive effects in Popper causes scroll jump.
  useEnhancedEffect(() => {
    if (autoFocus && !disabled && !isAnimating && !outsideCurrentMonth) {
      // ref.current being null would be a bug in MUI
      ref.current!.focus();
    }
  }, [autoFocus, disabled, isAnimating, outsideCurrentMonth]);

  // For a day outside the current month, move the focus from mouseDown to mouseUp
  // Goal: have the onClick ends before sliding to the new month
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMouseDown(event);
    if (outsideCurrentMonth) {
      event.preventDefault();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onDaySelect(day);
    }

    if (outsideCurrentMonth) {
      event.currentTarget.focus();
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <DateRangePickerDay2Root
      ref={handleRef}
      centerRipple
      // compat with DateRangePickerDay for tests
      data-testid={ownerState.isDayFillerCell ? undefined : 'DateRangePickerDay'}
      disabled={ownerState.isDayFillerCell ? undefined : disabled}
      tabIndex={selected ? 0 : -1}
      onKeyDown={(event) => onKeyDown(event, day)}
      onFocus={(event) => onFocus(event, day)}
      onBlur={(event) => onBlur(event, day)}
      onMouseEnter={(event) => onMouseEnter(event, day)}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      draggable={draggable}
      {...other}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
    >
      {/* `ownerState.isDayFillerCell` is used for compat with `PickersDay` for tests */}
      {children ?? (ownerState.isDayFillerCell ? null : utils.format(day, 'dayOfMonth'))}
    </DateRangePickerDay2Root>
  );
});

DateRangePickerDay2Raw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focusVisible: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.elementType,
  /**
   * The date to show.
   */
  day: PropTypes.object.isRequired,
  /**
   * If `true`, renders as disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true`, days are rendering without margin. Useful for displaying linked range of days.
   * @default false
   */
  disableMargin: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: PropTypes.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: PropTypes.bool,
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  draggable: PropTypes.bool,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: PropTypes.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: PropTypes.string,
  isAnimating: PropTypes.bool,
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is the end of a previewing date range.
   */
  isEndOfPreviewing: PropTypes.bool.isRequired,
  /**
   * If `true`, day is the first visible cell of the month.
   * Either the first day of the month or the first day of the week depending on `showDaysOutsideCurrentMonth`.
   */
  isFirstVisibleCell: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting: PropTypes.bool.isRequired,
  /**
   * If `true`, day is the last visible cell of the month.
   * Either the last day of the month or the last day of the week depending on `showDaysOutsideCurrentMonth`.
   */
  isLastVisibleCell: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is the start of a previewing date range.
   */
  isStartOfPreviewing: PropTypes.bool.isRequired,
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected: PropTypes.bool,
  onBlur: PropTypes.func,
  onDaySelect: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  /**
   * If `true`, day is outside of month and will be hidden.
   */
  outsideCurrentMonth: PropTypes.bool.isRequired,
  /**
   * If `true`, renders as selected.
   * @default false
   */
  selected: PropTypes.bool,
  /**
   * If `true`, days outside the current month are rendered:
   *
   * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
   *
   * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
   *
   * - ignored if `calendars` equals more than `1` on range pickers.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * @default 0
   */
  tabIndex: PropTypes.number,
  /**
   * If `true`, renders as today date.
   * @default false
   */
  today: PropTypes.bool,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: PropTypes.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        pulsate: PropTypes.func.isRequired,
        start: PropTypes.func.isRequired,
        stop: PropTypes.func.isRequired,
      }),
    }),
  ]),
} as any;

export const DateRangePickerDay2 = React.memo(
  DateRangePickerDay2Raw,
) as DateRangePickerDay2Component;
