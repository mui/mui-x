import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLicenseVerifier } from '@mui/x-license';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { useUtils } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import {
  DateRangePickerDayClasses,
  getDateRangePickerDayUtilityClass,
  dateRangePickerDayClasses,
} from './dateRangePickerDayClasses';
import { getReleaseInfo } from '../internals/utils/releaseInfo';

const releaseInfo = getReleaseInfo();

export interface DateRangePickerDayProps<TDate extends PickerValidDate>
  extends Omit<PickersDayProps<TDate>, 'classes' | 'onBlur' | 'onFocus' | 'onKeyDown'> {
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the end of a previewing date range.
   */
  isEndOfPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the start of a previewing date range.
   */
  isStartOfPreviewing: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangePickerDayClasses>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  draggable?: boolean;
}

type OwnerState = DateRangePickerDayProps<any> & {
  isEndOfMonth: boolean;
  isStartOfMonth: boolean;
  isFirstVisibleCell: boolean;
  isLastVisibleCell: boolean;
  isHiddenDayFiller: boolean;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    isHighlighting,
    outsideCurrentMonth,
    isStartOfHighlighting,
    isStartOfMonth,
    isEndOfHighlighting,
    isEndOfMonth,
    isPreviewing,
    isStartOfPreviewing,
    isEndOfPreviewing,
    isFirstVisibleCell,
    isLastVisibleCell,
    isHiddenDayFiller,
    selected,
    classes,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isHighlighting && 'rangeIntervalDayHighlight',
      isStartOfHighlighting && 'rangeIntervalDayHighlightStart',
      isEndOfHighlighting && 'rangeIntervalDayHighlightEnd',
      outsideCurrentMonth && 'outsideCurrentMonth',
      isStartOfMonth && 'startOfMonth',
      isEndOfMonth && 'endOfMonth',
      isFirstVisibleCell && 'firstVisibleCell',
      isLastVisibleCell && 'lastVisibleCell',
      isHiddenDayFiller && 'hiddenDayFiller',
    ],
    rangeIntervalPreview: [
      'rangeIntervalPreview',
      isPreviewing && 'rangeIntervalDayPreview',
      (isStartOfPreviewing || isStartOfMonth) && 'rangeIntervalDayPreviewStart',
      (isEndOfPreviewing || isEndOfMonth) && 'rangeIntervalDayPreviewEnd',
    ],
    day: [
      'day',
      !selected && 'notSelectedDate',
      !isHighlighting && 'dayOutsideRangeInterval',
      !selected && isHighlighting && 'dayInsideRangeInterval',
    ],
  };

  return composeClasses(slots, getDateRangePickerDayUtilityClass, classes);
};

const endBorderStyle = {
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
};

const startBorderStyle = {
  borderTopLeftRadius: '50%',
  borderBottomLeftRadius: '50%',
};

const DateRangePickerDayRoot = styled('div', {
  name: 'MuiDateRangePickerDay',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlight}`]:
        styles.rangeIntervalDayHighlight,
    },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlightStart}`]:
        styles.rangeIntervalDayHighlightStart,
    },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlightEnd}`]:
        styles.rangeIntervalDayHighlightEnd,
    },
    {
      [`&.${dateRangePickerDayClasses.firstVisibleCell}`]: styles.firstVisibleCell,
    },
    {
      [`&.${dateRangePickerDayClasses.lastVisibleCell}`]: styles.lastVisibleCell,
    },
    {
      [`&.${dateRangePickerDayClasses.startOfMonth}`]: styles.startOfMonth,
    },
    {
      [`&.${dateRangePickerDayClasses.endOfMonth}`]: styles.endOfMonth,
    },
    {
      [`&.${dateRangePickerDayClasses.outsideCurrentMonth}`]: styles.outsideCurrentMonth,
    },
    {
      [`&.${dateRangePickerDayClasses.hiddenDayFiller}`]: styles.hiddenDayFiller,
    },
    styles.root,
  ],
})<{ ownerState: OwnerState }>(({ theme }) => ({
  variants: [
    {
      props: { isHiddenDayFiller: false },
      style: {
        [`&:first-of-type .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
          ...startBorderStyle,
          borderLeftColor: (theme.vars || theme).palette.divider,
        },
        [`&:last-of-type .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
          ...endBorderStyle,
          borderRightColor: (theme.vars || theme).palette.divider,
        },
      },
    },
    {
      props: { isHiddenDayFiller: false, isHighlighting: true },
      style: {
        borderRadius: 0,
        color: (theme.vars || theme).palette.primary.contrastText,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
          : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
        '&:first-of-type': startBorderStyle,
        '&:last-of-type': endBorderStyle,
      },
    },
    {
      props: ({
        ownerState: { isHiddenDayFiller, isStartOfHighlighting, isFirstVisibleCell },
      }: {
        ownerState: OwnerState;
      }) => !isHiddenDayFiller && (isStartOfHighlighting || isFirstVisibleCell),
      style: {
        ...startBorderStyle,
        paddingLeft: 0,
      },
    },
    {
      props: ({
        ownerState: { isHiddenDayFiller, isEndOfHighlighting, isLastVisibleCell },
      }: {
        ownerState: OwnerState;
      }) => !isHiddenDayFiller && (isEndOfHighlighting || isLastVisibleCell),
      style: {
        ...endBorderStyle,
        paddingRight: 0,
      },
    },
  ],
}));

const DateRangePickerDayRangeIntervalPreview = styled('div', {
  name: 'MuiDateRangePickerDay',
  slot: 'RangeIntervalPreview',
  overridesResolver: (_, styles) => [
    { [`&.${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: styles.rangeIntervalDayPreview },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayPreviewStart}`]:
        styles.rangeIntervalDayPreviewStart,
    },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayPreviewEnd}`]:
        styles.rangeIntervalDayPreviewEnd,
    },
    styles.rangeIntervalPreview,
  ],
})<{ ownerState: OwnerState }>(({ theme }) => ({
  // replace default day component margin with transparent border to avoid jumping on preview
  border: '2px solid transparent',
  variants: [
    {
      props: { isPreviewing: true, isHiddenDayFiller: false },
      style: {
        borderRadius: 0,
        border: `2px dashed ${(theme.vars || theme).palette.divider}`,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      },
    },
    {
      props: ({
        ownerState: { isPreviewing, isHiddenDayFiller, isStartOfPreviewing, isFirstVisibleCell },
      }: {
        ownerState: OwnerState;
      }) => isPreviewing && !isHiddenDayFiller && (isStartOfPreviewing || isFirstVisibleCell),
      style: {
        borderLeftColor: (theme.vars || theme).palette.divider,
        ...startBorderStyle,
      },
    },
    {
      props: ({
        ownerState: { isPreviewing, isHiddenDayFiller, isEndOfPreviewing, isLastVisibleCell },
      }: {
        ownerState: OwnerState;
      }) => isPreviewing && !isHiddenDayFiller && (isEndOfPreviewing || isLastVisibleCell),
      style: {
        borderRightColor: (theme.vars || theme).palette.divider,
        ...endBorderStyle,
      },
    },
  ],
}));

const DateRangePickerDayDay = styled(PickersDay, {
  name: 'MuiDateRangePickerDay',
  slot: 'Day',
  overridesResolver: (_, styles) => [
    { [`&.${dateRangePickerDayClasses.dayInsideRangeInterval}`]: styles.dayInsideRangeInterval },
    { [`&.${dateRangePickerDayClasses.dayOutsideRangeInterval}`]: styles.dayOutsideRangeInterval },
    { [`&.${dateRangePickerDayClasses.notSelectedDate}`]: styles.notSelectedDate },
    styles.day,
  ],
})<{
  ownerState: OwnerState;
}>({
  // Required to overlap preview border
  transform: 'scale(1.1)',
  '& > *': {
    transform: 'scale(0.9)',
  },
  variants: [
    {
      props: { draggable: true },
      style: {
        cursor: 'grab',
        touchAction: 'none',
      },
    },
  ],
}) as unknown as <TDate extends PickerValidDate>(
  props: PickersDayProps<TDate> & { ownerState: OwnerState },
) => React.JSX.Element;

type DateRangePickerDayComponent = <TDate extends PickerValidDate>(
  props: DateRangePickerDayProps<TDate> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element;

const DateRangePickerDayRaw = React.forwardRef(function DateRangePickerDay<
  TDate extends PickerValidDate,
>(inProps: DateRangePickerDayProps<TDate>, ref: React.Ref<HTMLButtonElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerDay' });
  const {
    className,
    day,
    outsideCurrentMonth,
    isEndOfHighlighting,
    isEndOfPreviewing,
    isHighlighting,
    isPreviewing,
    isStartOfHighlighting,
    isStartOfPreviewing,
    selected = false,
    isVisuallySelected,
    sx,
    draggable,
    isFirstVisibleCell,
    isLastVisibleCell,
    ...other
  } = props;

  useLicenseVerifier('x-date-pickers-pro', releaseInfo);
  const utils = useUtils<TDate>();

  const isEndOfMonth = utils.isSameDay(day, utils.endOfMonth(day));
  const isStartOfMonth = utils.isSameDay(day, utils.startOfMonth(day));

  const shouldRenderHighlight = isHighlighting && !outsideCurrentMonth;
  const shouldRenderPreview = isPreviewing && !outsideCurrentMonth;

  const ownerState = {
    ...props,
    selected,
    isStartOfMonth,
    isEndOfMonth,
    draggable,
    isFirstVisibleCell,
    isLastVisibleCell,
    isHiddenDayFiller: outsideCurrentMonth && !other.showDaysOutsideCurrentMonth,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <DateRangePickerDayRoot
      data-mui-test={shouldRenderHighlight ? 'DateRangeHighlight' : undefined}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      sx={sx}
    >
      <DateRangePickerDayRangeIntervalPreview
        data-mui-test={shouldRenderPreview ? 'DateRangePreview' : undefined}
        className={classes.rangeIntervalPreview}
        ownerState={ownerState}
      >
        <DateRangePickerDayDay<TDate>
          {...other}
          ref={ref}
          disableMargin
          day={day}
          selected={isVisuallySelected}
          outsideCurrentMonth={outsideCurrentMonth}
          data-mui-test="DateRangePickerDay"
          className={classes.day}
          ownerState={ownerState}
          draggable={draggable}
          isFirstVisibleCell={isFirstVisibleCell}
          isLastVisibleCell={isLastVisibleCell}
        />
      </DateRangePickerDayRangeIntervalPreview>
    </DateRangePickerDayRoot>
  );
});

DateRangePickerDayRaw.propTypes = {
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
  onDaySelect: PropTypes.func.isRequired,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: PropTypes.func,
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

/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 *
 * API:
 *
 * - [DateRangePickerDay API](https://mui.com/x/api/date-pickers/date-range-picker-day/)
 */
export const DateRangePickerDay = React.memo(DateRangePickerDayRaw) as DateRangePickerDayComponent;
