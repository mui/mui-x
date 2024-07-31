import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEventCallback from '@mui/utils/useEventCallback';
import useMediaQuery from '@mui/material/useMediaQuery';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import { Watermark } from '@mui/x-license';
import {
  applyDefaultDate,
  BaseDateValidationProps,
  DayCalendar,
  DayCalendarSlots,
  DayCalendarSlotProps,
  useDefaultReduceAnimations,
  useCalendarState,
  useDefaultDates,
  useUtils,
  PickerSelectionState,
  useNow,
  DEFAULT_DESKTOP_MODE_MEDIA_QUERY,
  warnOnce,
  useControlledValueWithTimezone,
  useViews,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { getReleaseInfo } from '../internals/utils/releaseInfo';
import {
  dateRangeCalendarClasses,
  getDateRangeCalendarUtilityClass,
} from './dateRangeCalendarClasses';
import {
  DateRangeCalendarProps,
  DateRangeCalendarDefaultizedProps,
  DateRangeCalendarOwnerState,
} from './DateRangeCalendar.types';
import {
  isEndOfRange,
  isRangeValid,
  isStartOfRange,
  isWithinRange,
} from '../internals/utils/date-utils';
import { calculateRangeChange, calculateRangePreview } from '../internals/utils/date-range-manager';
import { DateRange, RangePosition } from '../models';
import { DateRangePickerDay, dateRangePickerDayClasses as dayClasses } from '../DateRangePickerDay';
import { rangeValueManager } from '../internals/utils/valueManagers';
import { useDragRange } from './useDragRange';
import { useRangePosition } from '../internals/hooks/useRangePosition';
import { DAY_RANGE_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import {
  PickersRangeCalendarHeader,
  PickersRangeCalendarHeaderProps,
} from '../PickersRangeCalendarHeader';

const releaseInfo = getReleaseInfo();

const DateRangeCalendarRoot = styled('div', {
  name: 'MuiDateRangeCalendar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: DateRangeCalendarOwnerState<any> }>({
  display: 'flex',
  flexDirection: 'row',
});

const DateRangeCalendarMonthContainer = styled('div', {
  name: 'MuiDateRangeCalendar',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.monthContainer,
})(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const weeksContainerHeight = (DAY_RANGE_SIZE + DAY_MARGIN * 2) * 6;

const DayCalendarForRange = styled(DayCalendar)(({ theme }) => ({
  minWidth: 312,
  minHeight: weeksContainerHeight,
  [`&.${dateRangeCalendarClasses.dayDragging}`]: {
    [`& .${dayClasses.day}`]: {
      cursor: 'grabbing',
    },
    [`& .${dayClasses.root}:not(.${dayClasses.rangeIntervalDayHighlightStart}):not(.${dayClasses.rangeIntervalDayHighlightEnd}) .${dayClasses.day}:not(.${dayClasses.notSelectedDate})`]:
      {
        // we can't override `PickersDay` background color here, because it's styles take precedence
        opacity: 0.6,
      },
  },
  [`&:not(.${dateRangeCalendarClasses.dayDragging}) .${dayClasses.dayOutsideRangeInterval}`]: {
    '@media (pointer: fine)': {
      '&:hover': {
        border: `1px solid ${(theme.vars || theme).palette.grey[500]}`,
      },
    },
  },
})) as typeof DayCalendar;

function useDateRangeCalendarDefaultizedProps<TDate extends PickerValidDate>(
  props: DateRangeCalendarProps<TDate>,
  name: string,
): DateRangeCalendarDefaultizedProps<TDate> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const defaultReduceAnimations = useDefaultReduceAnimations();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    ...themeProps,
    renderLoading:
      themeProps.renderLoading ?? (() => <span data-mui-test="loading-progress">...</span>),
    reduceAnimations: themeProps.reduceAnimations ?? defaultReduceAnimations,
    loading: props.loading ?? false,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    openTo: themeProps.openTo ?? 'day',
    views: themeProps.views ?? ['day'],
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    calendars: themeProps.calendars ?? 2,
    disableDragEditing: themeProps.disableDragEditing ?? false,
    availableRangePositions: themeProps.availableRangePositions ?? ['start', 'end'],
  };
}

const useUtilityClasses = (ownerState: DateRangeCalendarOwnerState<any>) => {
  const { classes, isDragging } = ownerState;
  const slots = {
    root: ['root'],
    monthContainer: ['monthContainer'],
    dayCalendar: [isDragging && 'dayDragging'],
  };

  return composeClasses(slots, getDateRangeCalendarUtilityClass, classes);
};

type DateRangeCalendarComponent = (<TDate extends PickerValidDate>(
  props: DateRangeCalendarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 * - [DateRangeCalendar](https://mui.com/x/react-date-pickers/date-range-calendar/)
 *
 * API:
 *
 * - [DateRangeCalendar API](https://mui.com/x/api/date-pickers/date-range-calendar/)
 */
const DateRangeCalendar = React.forwardRef(function DateRangeCalendar<
  TDate extends PickerValidDate,
>(inProps: DateRangeCalendarProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const props = useDateRangeCalendarDefaultizedProps(inProps, 'MuiDateRangeCalendar');
  const shouldHavePreview = useMediaQuery(DEFAULT_DESKTOP_MODE_MEDIA_QUERY, {
    defaultMatches: false,
  });

  const {
    value: valueProp,
    defaultValue,
    referenceDate,
    onChange,
    className,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    shouldDisableDate,
    reduceAnimations,
    onMonthChange,
    rangePosition: rangePositionProp,
    defaultRangePosition: inDefaultRangePosition,
    onRangePositionChange: inOnRangePositionChange,
    calendars,
    currentMonthCalendarPosition = 1,
    slots,
    slotProps,
    loading,
    renderLoading,
    disableHighlightToday,
    readOnly,
    disabled,
    showDaysOutsideCurrentMonth,
    dayOfWeekFormatter,
    disableAutoMonthSwitching,
    autoFocus,
    fixedWeekNumber,
    disableDragEditing,
    displayWeekNumber,
    timezone: timezoneProp,
    availableRangePositions,
    views,
    view: inView,
    openTo,
    onViewChange,
    ...other
  } = props;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone<
    TDate,
    DateRange<TDate>,
    NonNullable<typeof onChange>
  >({
    name: 'DateRangeCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: rangeValueManager,
  });

  const { setValueAndGoToNextView, view } = useViews({
    view: inView,
    views,
    openTo,
    onChange: handleValueChange,
    onViewChange,
    autoFocus,
  });

  const utils = useUtils<TDate>();
  const now = useNow<TDate>(timezone);
  const id = useId();

  const { rangePosition, onRangePositionChange } = useRangePosition({
    rangePosition: rangePositionProp,
    defaultRangePosition: inDefaultRangePosition,
    onRangePositionChange: inOnRangePositionChange,
  });

  const handleDatePositionChange = useEventCallback((position: RangePosition) => {
    if (rangePosition !== position) {
      onRangePositionChange(position);
    }
  });

  const handleSelectedDayChange = useEventCallback(
    (
      newDate: TDate | null,
      selectionState: PickerSelectionState | undefined,
      allowRangeFlip: boolean = false,
    ) => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate,
        utils,
        range: value,
        rangePosition,
        allowRangeFlip,
        shouldMergeDateAndTime: true,
      });

      const isNextSectionAvailable = availableRangePositions.includes(nextSelection);
      if (isNextSectionAvailable) {
        onRangePositionChange(nextSelection);
      }

      const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, newRange);
      setValueAndGoToNextView(
        newRange,
        isFullRangeSelected || !isNextSectionAvailable ? 'finish' : 'partial',
        view,
      );
    },
  );

  const handleDrop = useEventCallback((newDate: TDate) => {
    handleSelectedDayChange(newDate, undefined, true);
  });

  const shouldDisableDragEditing = disableDragEditing || disabled || readOnly;

  // Range going for the start of the start day to the end of the end day.
  // This makes sure that `isWithinRange` works with any time in the start and end day.
  const valueDayRange = React.useMemo<DateRange<TDate>>(
    () => [
      value[0] == null || !utils.isValid(value[0]) ? value[0] : utils.startOfDay(value[0]),
      value[1] == null || !utils.isValid(value[1]) ? value[1] : utils.endOfDay(value[1]),
    ],
    [value, utils],
  );

  const { isDragging, rangeDragDay, draggingDatePosition, ...dragEventHandlers } = useDragRange({
    disableDragEditing: shouldDisableDragEditing,
    onDrop: handleDrop,
    onDatePositionChange: handleDatePositionChange,
    utils,
    dateRange: valueDayRange,
    timezone,
  });

  const ownerState = { ...props, isDragging };
  const classes = useUtilityClasses(ownerState);

  const draggingRange = React.useMemo<DateRange<TDate>>(() => {
    if (!valueDayRange[0] || !valueDayRange[1] || !rangeDragDay) {
      return [null, null];
    }
    const newRange = calculateRangeChange({
      utils,
      range: valueDayRange,
      newDate: rangeDragDay,
      rangePosition,
      allowRangeFlip: true,
    }).newRange;
    return newRange[0] !== null && newRange[1] !== null
      ? [utils.startOfDay(newRange[0]), utils.endOfDay(newRange[1])]
      : newRange;
  }, [rangePosition, rangeDragDay, utils, valueDayRange]);

  const wrappedShouldDisableDate = React.useMemo(() => {
    if (!shouldDisableDate) {
      return undefined;
    }

    return (dayToTest: TDate) =>
      shouldDisableDate(dayToTest, draggingDatePosition || rangePosition);
  }, [shouldDisableDate, rangePosition, draggingDatePosition]);

  const {
    calendarState,
    changeFocusedDay,
    changeMonth,
    handleChangeMonth,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState<TDate>({
    value: value[0] || value[1],
    referenceDate,
    disableFuture,
    disablePast,
    disableSwitchToMonthOnDayFocus: true,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate: wrappedShouldDisableDate,
    timezone,
  });

  const CalendarHeader = slots?.calendarHeader ?? PickersRangeCalendarHeader;
  const calendarHeaderProps: Omit<
    PickersRangeCalendarHeaderProps<TDate>,
    'month' | 'monthIndex'
  > = useSlotProps({
    elementType: CalendarHeader,
    externalSlotProps: slotProps?.calendarHeader,
    additionalProps: {
      calendars,
      views: ['day'],
      view: 'day',
      currentMonth: calendarState.currentMonth,
      onMonthChange: (newMonth, direction) => handleChangeMonth({ newMonth, direction }),
      minDate,
      maxDate,
      disabled,
      disablePast,
      disableFuture,
      reduceAnimations,
      timezone,
      slots,
      slotProps,
    },
    ownerState: props,
  });

  const prevValue = React.useRef<DateRange<TDate> | null>(null);
  React.useEffect(() => {
    const date = rangePosition === 'start' ? value[0] : value[1];
    if (!date || !utils.isValid(date)) {
      return;
    }

    const prevDate = rangePosition === 'start' ? prevValue.current?.[0] : prevValue.current?.[1];
    prevValue.current = value;

    // The current date did not change, this call comes either from a `rangePosition` change or a change in the other date.
    // In both cases, we don't want to change the visible month(s).
    if (disableAutoMonthSwitching && prevDate && utils.isEqual(prevDate, date)) {
      return;
    }

    const displayingMonthRange = calendars - 1;
    const currentMonthNumber = utils.getMonth(calendarState.currentMonth);
    const requestedMonthNumber = utils.getMonth(date);

    if (
      !utils.isSameYear(calendarState.currentMonth, date) ||
      requestedMonthNumber < currentMonthNumber ||
      requestedMonthNumber > currentMonthNumber + displayingMonthRange
    ) {
      const newMonth =
        rangePosition === 'start'
          ? date
          : // If need to focus end, scroll to the state when "end" is displaying in the last calendar
            utils.addMonths(date, -displayingMonthRange);

      changeMonth(newMonth);
    }
  }, [rangePosition, value]); // eslint-disable-line

  const baseDateValidationProps: Required<BaseDateValidationProps<TDate>> = {
    disablePast,
    disableFuture,
    maxDate,
    minDate,
  };

  const commonViewProps = {
    disableHighlightToday,
    readOnly,
    disabled,
  };

  const [rangePreviewDay, setRangePreviewDay] = React.useState<TDate | null>(null);

  const CalendarTransitionProps = React.useMemo(
    () => ({
      onMouseLeave: () => setRangePreviewDay(null),
    }),
    [],
  );

  const previewingRange = calculateRangePreview({
    utils,
    range: valueDayRange,
    newDate: rangePreviewDay,
    rangePosition,
  });

  const handleDayMouseEnter = useEventCallback(
    (event: React.MouseEvent<HTMLDivElement>, newPreviewRequest: TDate) => {
      if (!isWithinRange(utils, newPreviewRequest, valueDayRange)) {
        setRangePreviewDay(newPreviewRequest);
      } else {
        setRangePreviewDay(null);
      }
    },
  );

  const slotsForDayCalendar = {
    day: DateRangePickerDay,
    ...slots,
  } as DayCalendarSlots<TDate>;

  const slotPropsForDayCalendar = {
    ...slotProps,
    day: (dayOwnerState) => {
      const { day } = dayOwnerState;
      const isSelectedStartDate = isStartOfRange(utils, day, valueDayRange);
      const isSelectedEndDate = isEndOfRange(utils, day, valueDayRange);
      const shouldInitDragging = !shouldDisableDragEditing && valueDayRange[0] && valueDayRange[1];
      const isElementDraggable = shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
      let datePosition: RangePosition | undefined;
      if (isSelectedStartDate) {
        datePosition = 'start';
      } else if (isSelectedEndDate) {
        datePosition = 'end';
      }

      const isStartOfHighlighting = isDragging
        ? isStartOfRange(utils, day, draggingRange)
        : isSelectedStartDate;
      const isEndOfHighlighting = isDragging
        ? isEndOfRange(utils, day, draggingRange)
        : isSelectedEndDate;

      return {
        isPreviewing: shouldHavePreview ? isWithinRange(utils, day, previewingRange) : false,
        isStartOfPreviewing: shouldHavePreview
          ? isStartOfRange(utils, day, previewingRange)
          : false,
        isEndOfPreviewing: shouldHavePreview ? isEndOfRange(utils, day, previewingRange) : false,
        isHighlighting: isWithinRange(utils, day, isDragging ? draggingRange : valueDayRange),
        isStartOfHighlighting,
        isEndOfHighlighting: isDragging
          ? isEndOfRange(utils, day, draggingRange)
          : isSelectedEndDate,
        onMouseEnter: shouldHavePreview ? handleDayMouseEnter : undefined,
        // apply selected styling to the dragging start or end day
        isVisuallySelected:
          dayOwnerState.selected || (isDragging && (isStartOfHighlighting || isEndOfHighlighting)),
        'data-position': datePosition,
        ...dragEventHandlers,
        draggable: isElementDraggable ? true : undefined,
        ...(resolveComponentProps(slotProps?.day, dayOwnerState) ?? {}),
      };
    },
  } as DayCalendarSlotProps<TDate>;

  const calendarMonths = React.useMemo(
    () => Array.from({ length: calendars }).map((_, index) => index),
    [calendars],
  );

  const visibleMonths = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (currentMonthCalendarPosition > calendars || currentMonthCalendarPosition < 1) {
        warnOnce([
          'MUI X: The `currentMonthCalendarPosition` prop must be an integer between `1` and the amount of calendars rendered.',
          'For example if you have 2 calendars rendered, it should be equal to either 1 or 2.',
        ]);
      }
    }

    const firstMonth = utils.addMonths(
      calendarState.currentMonth,
      1 - currentMonthCalendarPosition,
    );

    return Array.from({ length: calendars }).map((_, index) => utils.addMonths(firstMonth, index));
  }, [utils, calendarState.currentMonth, calendars, currentMonthCalendarPosition]);

  const focusedMonth = React.useMemo(() => {
    if (!autoFocus) {
      return null;
    }

    // The focus priority of the "day" view is as follows:
    // 1. Month of the `start` date
    // 2. Month of the `end` date
    // 3. Month of the current date
    // 4. First visible month

    if (value[0] != null) {
      return visibleMonths.find((month) => utils.isSameMonth(month, value[0]!));
    }

    if (value[1] != null) {
      return visibleMonths.find((month) => utils.isSameMonth(month, value[1]!));
    }

    return visibleMonths.find((month) => utils.isSameMonth(month, now)) ?? visibleMonths[0];
  }, [utils, value, visibleMonths, autoFocus, now]);

  return (
    <DateRangeCalendarRoot
      ref={ref}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      {...other}
    >
      <Watermark packageName="x-date-pickers-pro" releaseInfo={releaseInfo} />
      {calendarMonths.map((monthIndex) => {
        const month = visibleMonths[monthIndex];
        const labelId = `${id}-grid-${monthIndex}-label`;

        return (
          <DateRangeCalendarMonthContainer key={monthIndex} className={classes.monthContainer}>
            <CalendarHeader<TDate>
              {...calendarHeaderProps}
              month={month}
              monthIndex={monthIndex}
              labelId={labelId}
            />
            <DayCalendarForRange<TDate>
              className={classes.dayCalendar}
              {...calendarState}
              {...baseDateValidationProps}
              {...commonViewProps}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={changeFocusedDay}
              reduceAnimations={reduceAnimations}
              selectedDays={value}
              onSelectedDaysChange={handleSelectedDayChange}
              currentMonth={month}
              TransitionProps={CalendarTransitionProps}
              shouldDisableDate={wrappedShouldDisableDate}
              showDaysOutsideCurrentMonth={calendars === 1 && showDaysOutsideCurrentMonth}
              dayOfWeekFormatter={dayOfWeekFormatter}
              loading={loading}
              renderLoading={renderLoading}
              slots={slotsForDayCalendar}
              slotProps={slotPropsForDayCalendar}
              autoFocus={month === focusedMonth}
              fixedWeekNumber={fixedWeekNumber}
              displayWeekNumber={displayWeekNumber}
              timezone={timezone}
              gridLabelId={labelId}
            />
          </DateRangeCalendarMonthContainer>
        );
      })}
    </DateRangeCalendarRoot>
  );
}) as DateRangeCalendarComponent;

DateRangeCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  /**
   * Range positions available for selection.
   * This list is checked against when checking if a next range position can be selected.
   *
   * Used on Date Time Range pickers with current `rangePosition` to force a `finish` selection after just one range position selection.
   * @default ['start', 'end']
   */
  availableRangePositions: PropTypes.arrayOf(PropTypes.oneOf(['end', 'start']).isRequired),
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars: PropTypes.oneOf([1, 2, 3]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Position the current month is rendered in.
   * @default 1
   */
  currentMonthCalendarPosition: PropTypes.oneOf([1, 2, 3]),
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {TDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: TDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * The initial position in the edited date range.
   * Used when the component is not controlled.
   * @default 'start'
   */
  defaultRangePosition: PropTypes.oneOf(['end', 'start']),
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching: PropTypes.bool,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, editing dates by dragging is disabled.
   * @default false
   */
  disableDragEditing: PropTypes.bool,
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber: PropTypes.bool,
  /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * Controlled focused view.
   */
  focusedView: PropTypes.oneOf(['day']),
  /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Maximal selectable date.
   * @default 2099-12-31
   */
  maxDate: PropTypes.object,
  /**
   * Minimal selectable date.
   * @default 1900-01-01
   */
  minDate: PropTypes.object,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TView The view type. Will be one of date or time views.
   * @param {TValue} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired on focused view change.
   * @template TView
   * @param {TView} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */
  onFocusedViewChange: PropTypes.func,
  /**
   * Callback fired on month change.
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired when the range position changes.
   * @param {RangePosition} rangePosition The new range position.
   */
  onRangePositionChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: PropTypes.oneOf(['day']),
  /**
   * The position in the currently edited date range.
   * Used when the component position is controlled.
   */
  rangePosition: PropTypes.oneOf(['end', 'start']),
  /**
   * Make picker read only.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations: PropTypes.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
   */
  referenceDate: PropTypes.object,
  /**
   * Component rendered on the "day" view when `props.loading` is true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading: PropTypes.func,
  /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
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
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */
  timezone: PropTypes.string,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.arrayOf(PropTypes.object),
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view: PropTypes.oneOf(['day']),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day'])),
} as any;

export { DateRangeCalendar };
