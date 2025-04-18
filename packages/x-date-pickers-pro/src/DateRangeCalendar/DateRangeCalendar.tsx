'use client';
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
  BaseDateValidationProps,
  DayCalendar,
  DayCalendarSlots,
  DayCalendarSlotProps,
  useReduceAnimations,
  useCalendarState,
  useUtils,
  PickerSelectionState,
  DEFAULT_DESKTOP_MODE_MEDIA_QUERY,
  useControlledValue,
  useViews,
  PickerRangeValue,
  usePickerPrivateContext,
  areDatesEqual,
  useApplyDefaultValuesToDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { warnOnce } from '@mui/x-internals/warning';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DateRangeCalendarClasses,
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
import { RangePosition } from '../models';
import { DateRangePickerDay, dateRangePickerDayClasses as dayClasses } from '../DateRangePickerDay';
import { rangeValueManager } from '../internals/utils/valueManagers';
import { useDragRange } from './useDragRange';
import { useRangePosition } from '../internals/hooks/useRangePosition';
import { DAY_RANGE_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import {
  PickersRangeCalendarHeader,
  PickersRangeCalendarHeaderProps,
} from '../PickersRangeCalendarHeader';
import { useNullablePickerRangePositionContext } from '../internals/hooks/useNullablePickerRangePositionContext';
import { EnhancedDateRangePickerDay } from '../EnhancedDateRangePickerDay/EnhancedDateRangePickerDay';

const releaseInfo = '__RELEASE_INFO__';

const DateRangeCalendarRoot = styled('div', {
  name: 'MuiDateRangeCalendar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: DateRangeCalendarOwnerState }>({
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

const InnerDayCalendarForRange = styled(DayCalendar)(({ theme }) => ({
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
}));

const DayCalendarForRange = InnerDayCalendarForRange as typeof DayCalendar;

function useDateRangeCalendarDefaultizedProps(
  props: DateRangeCalendarProps,
  name: string,
): DateRangeCalendarDefaultizedProps {
  const themeProps = useThemeProps({
    props,
    name,
  });
  const reduceAnimations = useReduceAnimations(themeProps.reduceAnimations);
  const validationProps = useApplyDefaultValuesToDateValidationProps(themeProps);

  return {
    ...themeProps,
    ...validationProps,
    renderLoading:
      themeProps.renderLoading ?? (() => <span data-testid="loading-progress">...</span>),
    reduceAnimations,
    loading: props.loading ?? false,
    openTo: themeProps.openTo ?? 'day',
    views: themeProps.views ?? ['day'],
    calendars: themeProps.calendars ?? 2,
    disableDragEditing: themeProps.disableDragEditing ?? false,
    availableRangePositions: themeProps.availableRangePositions ?? ['start', 'end'],
    enableEnhancedDaySlot: themeProps.enableEnhancedDaySlot ?? false,
  };
}

const useUtilityClasses = (
  classes: Partial<DateRangeCalendarClasses> | undefined,
  ownerState: DateRangeCalendarOwnerState,
) => {
  const slots = {
    root: ['root'],
    monthContainer: ['monthContainer'],
    dayCalendar: [ownerState.isDraggingDay && 'dayDragging'],
  };

  return composeClasses(slots, getDateRangeCalendarUtilityClass, classes);
};

type DateRangeCalendarComponent = ((
  props: DateRangeCalendarProps & React.RefAttributes<HTMLDivElement>,
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
const DateRangeCalendar = React.forwardRef(function DateRangeCalendar(
  inProps: DateRangeCalendarProps,
  ref: React.Ref<HTMLDivElement>,
) {
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
    classes: classesProp,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    shouldDisableDate,
    reduceAnimations,
    onMonthChange,
    rangePosition: rangePositionProp,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp,
    calendars,
    currentMonthCalendarPosition = 1,
    slots,
    slotProps,
    loading,
    renderLoading,
    disableHighlightToday,
    focusedView: focusedViewProp,
    onFocusedViewChange,
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
    enableEnhancedDaySlot,
    ...other
  } = props;

  const rangePositionContext = useNullablePickerRangePositionContext();

  const { value, handleValueChange, timezone } = useControlledValue<
    PickerRangeValue,
    NonNullable<typeof onChange>
  >({
    name: 'DateRangeCalendar',
    timezone: timezoneProp,
    value: valueProp,
    referenceDate,
    defaultValue,
    onChange,
    valueManager: rangeValueManager,
  });

  const { view, setFocusedView, focusedView, setValueAndGoToNextView } = useViews({
    view: inView,
    views,
    openTo,
    onChange: handleValueChange,
    onViewChange,
    autoFocus,
    focusedView: focusedViewProp,
    onFocusedViewChange,
  });

  const utils = useUtils();
  const id = useId();

  const { rangePosition, setRangePosition } = useRangePosition({
    rangePosition: rangePositionProp ?? rangePositionContext?.rangePosition,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp ?? rangePositionContext?.setRangePosition,
  });

  const handleDatePositionChange = useEventCallback((position: RangePosition) => {
    if (rangePosition !== position) {
      setRangePosition(position);
    }
  });

  const handleSelectedDayChange = useEventCallback(
    (
      newDate: PickerValidDate | null,
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
        referenceDate,
      });

      const isNextSectionAvailable = availableRangePositions.includes(nextSelection);
      if (isNextSectionAvailable) {
        setRangePosition(nextSelection);
      }

      const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, newRange);
      setValueAndGoToNextView(
        newRange,
        isFullRangeSelected || !isNextSectionAvailable ? 'finish' : 'partial',
        view,
      );
    },
  );

  const handleDrop = useEventCallback((newDate: PickerValidDate) => {
    handleSelectedDayChange(newDate, undefined, true);
  });

  const shouldDisableDragEditing = disableDragEditing || disabled || readOnly;

  // Range going for the start of the start day to the end of the end day.
  // This makes sure that `isWithinRange` works with any time in the start and end day.
  const valueDayRange = React.useMemo<PickerRangeValue>(
    () => [
      !utils.isValid(value[0]) ? value[0] : utils.startOfDay(value[0]),
      !utils.isValid(value[1]) ? value[1] : utils.endOfDay(value[1]),
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

  const { ownerState: pickersOwnerState } = usePickerPrivateContext();
  const ownerState: DateRangeCalendarOwnerState = {
    ...pickersOwnerState,
    isDraggingDay: isDragging,
  };
  const classes = useUtilityClasses(classesProp, ownerState);

  const draggingRange = React.useMemo<PickerRangeValue>(() => {
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

    return (dayToTest: PickerValidDate) =>
      shouldDisableDate(dayToTest, draggingDatePosition || rangePosition);
  }, [shouldDisableDate, rangePosition, draggingDatePosition]);

  const { calendarState, setVisibleDate, onMonthSwitchingAnimationEnd } = useCalendarState({
    value: value[0] || value[1],
    referenceDate,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate: wrappedShouldDisableDate,
    timezone,
    getCurrentMonthFromVisibleDate: (visibleDate, prevMonth) => {
      const firstVisibleMonth = utils.addMonths(prevMonth, 1 - currentMonthCalendarPosition);
      const lastVisibleMonth = utils.endOfMonth(utils.addMonths(firstVisibleMonth, calendars - 1));

      // The new focused day is inside the visible calendars,
      // Do not change the current month
      if (utils.isWithinRange(visibleDate, [firstVisibleMonth, lastVisibleMonth])) {
        return prevMonth;
      }

      // The new focused day is after the last visible month,
      // Move the current month so that the new focused day is inside the first visible month
      if (utils.isAfter(visibleDate, lastVisibleMonth)) {
        return utils.startOfMonth(utils.addMonths(visibleDate, currentMonthCalendarPosition - 1));
      }

      // The new focused day is before the first visible month,
      // Move the current month so that the new focused day is inside the last visible month
      return utils.startOfMonth(
        utils.addMonths(visibleDate, currentMonthCalendarPosition - calendars),
      );
    },
  });

  const CalendarHeader = slots?.calendarHeader ?? PickersRangeCalendarHeader;
  const calendarHeaderProps: Omit<PickersRangeCalendarHeaderProps, 'month' | 'monthIndex'> =
    useSlotProps({
      elementType: CalendarHeader,
      externalSlotProps: slotProps?.calendarHeader,
      additionalProps: {
        calendars,
        views: ['day'],
        view: 'day',
        currentMonth: calendarState.currentMonth,
        onMonthChange: (month) => setVisibleDate({ target: month, reason: 'header-navigation' }),
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
      ownerState,
    });

  // TODO: Move this logic inside the render instead of using an effect
  const prevValue = React.useRef<PickerRangeValue | null>(null);
  React.useEffect(() => {
    const date = rangePosition === 'start' ? value[0] : value[1];
    if (!utils.isValid(date)) {
      return;
    }

    const prevDate = rangePosition === 'start' ? prevValue.current?.[0] : prevValue.current?.[1];
    prevValue.current = value;

    // The current date did not change, this call comes either from a `rangePosition` change or a change in the other date.
    // In both cases, we don't want to change the visible month(s).
    if (disableAutoMonthSwitching && prevDate && utils.isEqual(prevDate, date)) {
      return;
    }

    const displayingMonthRange = calendars - currentMonthCalendarPosition;
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

      setVisibleDate({ target: newMonth, reason: 'controlled-value-change' });
    }
  }, [rangePosition, value]); // eslint-disable-line

  const baseDateValidationProps: Required<BaseDateValidationProps> = {
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

  const [rangePreviewDay, setRangePreviewDay] = React.useState<PickerValidDate | null>(null);

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
    (event: React.MouseEvent<HTMLDivElement>, newRangePreviewDay: PickerValidDate) => {
      let cleanNewRangePreviewDay: PickerValidDate | null;
      if (valueDayRange[0] == null && valueDayRange[1] == null) {
        cleanNewRangePreviewDay = null;
      } else if (isWithinRange(utils, newRangePreviewDay, valueDayRange)) {
        cleanNewRangePreviewDay = null;
      } else {
        cleanNewRangePreviewDay = newRangePreviewDay;
      }

      if (!areDatesEqual(utils, cleanNewRangePreviewDay, rangePreviewDay)) {
        setRangePreviewDay(cleanNewRangePreviewDay);
      }
    },
  );

  const slotsForDayCalendar = {
    day: enableEnhancedDaySlot ? EnhancedDateRangePickerDay : DateRangePickerDay,
    ...slots,
  } as DayCalendarSlots;

  const slotPropsForDayCalendar = {
    ...slotProps,
    day: (dayOwnerState) => {
      const { day, isDaySelected } = dayOwnerState;
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
          isDaySelected || (isDragging && (isStartOfHighlighting || isEndOfHighlighting)),
        'data-position': datePosition,
        ...dragEventHandlers,
        draggable: isElementDraggable ? true : undefined,
        ...(resolveComponentProps(slotProps?.day, dayOwnerState) ?? {}),
      };
    },
  } as DayCalendarSlotProps;

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

  const hasFocus = focusedView !== null;

  const prevOpenViewRef = React.useRef(view);
  React.useEffect(() => {
    // If the view change and the focus was on the previous view
    // Then we update the focus.
    if (prevOpenViewRef.current === view) {
      return;
    }

    if (focusedView === prevOpenViewRef.current) {
      setFocusedView(view, true);
    }
    prevOpenViewRef.current = view;
  }, [focusedView, setFocusedView, view]);

  return (
    <DateRangeCalendarRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <Watermark packageName="x-date-pickers-pro" releaseInfo={releaseInfo} />
      {calendarMonths.map((monthIndex) => {
        const month = visibleMonths[monthIndex];
        const labelId = `${id}-grid-${monthIndex}-label`;

        return (
          <DateRangeCalendarMonthContainer key={monthIndex} className={classes.monthContainer}>
            <CalendarHeader
              {...calendarHeaderProps}
              month={month}
              monthIndex={monthIndex}
              labelId={labelId}
            />
            <DayCalendarForRange
              className={classes.dayCalendar}
              {...calendarState}
              {...baseDateValidationProps}
              {...commonViewProps}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={(focusedDate) =>
                setVisibleDate({ target: focusedDate, reason: 'cell-interaction' })
              }
              reduceAnimations={reduceAnimations}
              selectedDays={value}
              onSelectedDaysChange={handleSelectedDayChange}
              currentMonth={month}
              TransitionProps={CalendarTransitionProps}
              shouldDisableDate={wrappedShouldDisableDate}
              hasFocus={hasFocus}
              onFocusedViewChange={(isViewFocused) => setFocusedView('day', isViewFocused)}
              showDaysOutsideCurrentMonth={calendars === 1 && showDaysOutsideCurrentMonth}
              dayOfWeekFormatter={dayOfWeekFormatter}
              loading={loading}
              renderLoading={renderLoading}
              slots={slotsForDayCalendar}
              slotProps={slotPropsForDayCalendar}
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
   * @param {PickerValidDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
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
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
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
   * If `true`, day slot will use the v8 version.
   * @default false
   */
  enableEnhancedDaySlot: PropTypes.bool,
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
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
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
   * @param {PickerValidDate} month The new month.
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
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
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
   * @param {PickerValidDate} day The date to test.
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
