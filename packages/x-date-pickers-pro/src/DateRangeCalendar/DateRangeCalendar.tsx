import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEventCallback from '@mui/utils/useEventCallback';
import useControlled from '@mui/utils/useControlled';
import { resolveComponentProps } from '@mui/base/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { Watermark } from '@mui/x-license-pro';
import {
  applyDefaultDate,
  BaseDateValidationProps,
  DAY_MARGIN,
  DayCalendar,
  DayCalendarSlotsComponent,
  DayCalendarSlotsComponentsProps,
  defaultReduceAnimations,
  PickersArrowSwitcher,
  PickersCalendarHeader,
  useCalendarState,
  useDefaultDates,
  useLocaleText,
  useNextMonthDisabled,
  usePreviousMonthDisabled,
  useUtils,
  WrapperVariantContext,
  PickerSelectionState,
} from '@mui/x-date-pickers/internals';
import { getReleaseInfo } from '../internal/utils/releaseInfo';
import {
  dateRangeCalendarClasses,
  getDateRangeCalendarUtilityClass,
} from './dateRangeCalendarClasses';
import {
  DateRangeCalendarProps,
  DateRangeCalendarDefaultizedProps,
  DateRangePosition,
  DateRangeCalendarOwnerState,
} from './DateRangeCalendar.types';
import {
  isEndOfRange,
  isRangeValid,
  isStartOfRange,
  isWithinRange,
} from '../internal/utils/date-utils';
import { calculateRangeChange, calculateRangePreview } from '../DateRangePicker/date-range-manager';
import { DateRange } from '../internal/models';
import { DateRangePickerDay, dateRangePickerDayClasses as dayClasses } from '../DateRangePickerDay';
import { rangeValueManager } from '../internal/utils/valueManagers';
import { useDragRange } from './useDragRange';

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
    borderRight: `2px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const DateRangeCalendarArrowSwitcher = styled(PickersArrowSwitcher)({
  padding: '16px 16px 8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const DAY_RANGE_SIZE = 40;
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

function useDateRangeCalendarDefaultizedProps<TDate>(
  props: DateRangeCalendarProps<TDate>,
  name: string,
): DateRangeCalendarDefaultizedProps<TDate> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
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
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    calendars: themeProps.calendars ?? 2,
    disableDragEditing: themeProps.disableDragEditing ?? false,
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

type DateRangeCalendarComponent = (<TDate>(
  props: DateRangeCalendarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const DateRangeCalendar = React.forwardRef(function DateRangeCalendar<TDate>(
  inProps: DateRangeCalendarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();

  const props = useDateRangeCalendarDefaultizedProps(inProps, 'MuiDateRangeCalendar');
  const isMobile = React.useContext(WrapperVariantContext) === 'mobile';

  const {
    value: valueProp,
    defaultValue,
    onChange,
    className,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    shouldDisableDate,
    reduceAnimations,
    onMonthChange,
    defaultCalendarMonth,
    rangePosition: rangePositionProps,
    onRangePositionChange,
    calendars,
    components,
    componentsProps,
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
    ...other
  } = props;

  const [value, setValue] = useControlled<DateRange<TDate>>({
    controlled: valueProp,
    default: defaultValue ?? rangeValueManager.emptyValue,
    name: 'DateRangeCalendar',
    state: 'value',
  });

  const [rangePosition, setRangePosition] = useControlled<DateRangePosition>({
    controlled: rangePositionProps,
    default: 'start',
    name: 'DateRangeCalendar',
    state: 'rangePosition',
  });

  const handleDatePositionChange = useEventCallback((position: DateRangePosition) => {
    if (rangePosition !== position) {
      setRangePosition(position);
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
      });

      setRangePosition(nextSelection);
      onRangePositionChange?.(nextSelection);

      const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, newRange);

      setValue(newRange);
      onChange?.(newRange, isFullRangeSelected ? 'finish' : 'partial');
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
    defaultCalendarMonth,
    disableFuture,
    disablePast,
    disableSwitchToMonthOnDayFocus: true,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate: wrappedShouldDisableDate,
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

  const selectNextMonth = React.useCallback(() => {
    changeMonth(utils.getNextMonth(calendarState.currentMonth));
  }, [changeMonth, calendarState.currentMonth, utils]);

  const selectPreviousMonth = React.useCallback(() => {
    changeMonth(utils.getPreviousMonth(calendarState.currentMonth));
  }, [changeMonth, calendarState.currentMonth, utils]);

  const isNextMonthDisabled = useNextMonthDisabled(calendarState.currentMonth, {
    disableFuture,
    maxDate,
  });

  const isPreviousMonthDisabled = usePreviousMonthDisabled(calendarState.currentMonth, {
    disablePast,
    minDate,
  });

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

  // When disabled, limit the view to the selected date
  const minDateWithDisabled = (disabled && value[0]) || minDate;
  const maxDateWithDisabled = (disabled && value[1]) || maxDate;

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

  const componentsForDayCalendar = {
    Day: DateRangePickerDay,
    ...components,
  } as DayCalendarSlotsComponent<TDate>;

  const componentsPropsForDayCalendar = {
    ...componentsProps,
    day: (dayOwnerState) => {
      const { day } = dayOwnerState;
      const isSelectedStartDate = isStartOfRange(utils, day, valueDayRange);
      const isSelectedEndDate = isEndOfRange(utils, day, valueDayRange);
      const shouldInitDragging = !shouldDisableDragEditing && valueDayRange[0] && valueDayRange[1];
      const isElementDraggable = shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
      let datePosition: DateRangePosition | undefined;
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
        isPreviewing: isMobile ? false : isWithinRange(utils, day, previewingRange),
        isStartOfPreviewing: isMobile ? false : isStartOfRange(utils, day, previewingRange),
        isEndOfPreviewing: isMobile ? false : isEndOfRange(utils, day, previewingRange),
        isHighlighting: isWithinRange(utils, day, isDragging ? draggingRange : valueDayRange),
        isStartOfHighlighting,
        isEndOfHighlighting: isDragging
          ? isEndOfRange(utils, day, draggingRange)
          : isSelectedEndDate,
        onMouseEnter: handleDayMouseEnter,
        // apply selected styling to the dragging start or end day
        isVisuallySelected:
          dayOwnerState.selected || (isDragging && (isStartOfHighlighting || isEndOfHighlighting)),
        'data-position': datePosition,
        ...dragEventHandlers,
        draggable: isElementDraggable ? true : undefined,
        ...(resolveComponentProps(componentsProps?.day, dayOwnerState) ?? {}),
      };
    },
  } as DayCalendarSlotsComponentsProps<TDate>;

  const visibleMonths = React.useMemo(
    () =>
      Array.from({ length: calendars }).map((_, index) =>
        utils.setMonth(
          calendarState.currentMonth,
          utils.getMonth(calendarState.currentMonth) + index,
        ),
      ),
    [utils, calendarState.currentMonth, calendars],
  );

  return (
    <DateRangeCalendarRoot
      ref={ref}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      {...other}
    >
      <Watermark packageName="x-date-pickers-pro" releaseInfo={releaseInfo} />
      {visibleMonths.map((month, index) => (
        <DateRangeCalendarMonthContainer
          key={(month as any).toString()}
          className={classes.monthContainer}
        >
          {calendars === 1 ? (
            <PickersCalendarHeader
              views={['day']}
              openView={'day'}
              currentMonth={calendarState.currentMonth}
              onMonthChange={(newMonth, direction) => handleChangeMonth({ newMonth, direction })}
              minDate={minDateWithDisabled}
              maxDate={maxDateWithDisabled}
              disabled={disabled}
              disablePast={disablePast}
              disableFuture={disableFuture}
              reduceAnimations={reduceAnimations}
              components={components}
              componentsProps={componentsProps}
            />
          ) : (
            <DateRangeCalendarArrowSwitcher
              onGoToPrevious={selectPreviousMonth}
              onGoToNext={selectNextMonth}
              isPreviousHidden={index !== 0}
              isPreviousDisabled={isPreviousMonthDisabled}
              previousLabel={localeText.previousMonth}
              isNextHidden={index !== calendars - 1}
              isNextDisabled={isNextMonthDisabled}
              nextLabel={localeText.nextMonth}
              components={components}
              componentsProps={componentsProps}
            >
              {utils.format(month, 'monthAndYear')}
            </DateRangeCalendarArrowSwitcher>
          )}

          <DayCalendarForRange<TDate>
            key={index}
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
            showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
            dayOfWeekFormatter={dayOfWeekFormatter}
            loading={loading}
            renderLoading={renderLoading}
            components={componentsForDayCalendar}
            componentsProps={componentsPropsForDayCalendar}
            autoFocus={autoFocus}
            fixedWeekNumber={fixedWeekNumber}
            displayWeekNumber={displayWeekNumber}
          />
        </DateRangeCalendarMonthContainer>
      ))}
    </DateRangeCalendarRoot>
  );
}) as DateRangeCalendarComponent;

DateRangeCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: PropTypes.bool,
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars: PropTypes.oneOf([1, 2, 3]),
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {string} day The day of week provided by the adapter's method `getWeekdays`.
   * @returns {string} The name to display.
   * @default (day) => day.charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * Default calendar month displayed when `value={[null, null]}`.
   */
  defaultCalendarMonth: PropTypes.any,
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.any),
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
   * If `true` disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true` disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber: PropTypes.bool,
  /**
   * Calendar will show more weeks in order to match this value.
   * Put it to 6 for having fix number of week in Gregorian calendars
   * @default undefined
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Maximal selectable date.
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date.
   */
  minDate: PropTypes.any,
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {DateRange<TDate>} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date range selection is complete.
   */
  onChange: PropTypes.func,
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange: PropTypes.func,
  onRangePositionChange: PropTypes.func,
  rangePosition: PropTypes.oneOf(['end', 'start']),
  /**
   * Make picker read only.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations: PropTypes.bool,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading: PropTypes.func,
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.arrayOf(PropTypes.any),
} as any;

export { DateRangeCalendar };
