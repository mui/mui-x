import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import Typography from '@mui/material/Typography';
import useSlotProps from '@mui/utils/useSlotProps';
import { useRtl } from '@mui/system/RtlProvider';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useControlled as useControlled,
} from '@mui/utils';
import clsx from 'clsx';
import { PickersDay, PickersDayProps, ExportedPickersDayProps } from '../PickersDay/PickersDay';
import { usePickersTranslations } from '../hooks/usePickersTranslations';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { PickerOnChangeFn } from '../internals/hooks/useViews';
import { DAY_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import {
  PickersSlideTransition,
  SlideDirection,
  SlideTransitionProps,
} from './PickersSlideTransition';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { useIsDateDisabled } from './useIsDateDisabled';
import { findClosestEnabledDate, getWeekdays } from '../internals/utils/date-utils';
import { DayCalendarClasses, getDayCalendarUtilityClass } from './dayCalendarClasses';
import { PickerValidDate, TimezoneProps } from '../models';
import { DefaultizedProps, SlotComponentPropsFromProps } from '../internals/models/helpers';

export interface DayCalendarSlots<TDate extends PickerValidDate> {
  /**
   * Custom component for day.
   * Check the [PickersDay](https://mui.com/x/api/date-pickers/pickers-day/) component.
   * @default PickersDay
   */
  day?: React.ElementType<PickersDayProps<TDate>>;
}

export interface DayCalendarSlotProps<TDate extends PickerValidDate> {
  day?: SlotComponentPropsFromProps<
    PickersDayProps<TDate>,
    {},
    DayCalendarProps<TDate> & { day: TDate; selected: boolean }
  >;
}

export interface ExportedDayCalendarProps<TDate extends PickerValidDate>
  extends ExportedPickersDayProps {
  /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading?: boolean;
  /**
   * Component rendered on the "day" view when `props.loading` is true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {TDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: TDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */
  dayOfWeekFormatter?: (date: TDate) => string;
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber?: boolean;
  /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */
  fixedWeekNumber?: number;
}

export interface DayCalendarProps<TDate extends PickerValidDate>
  extends ExportedDayCalendarProps<TDate>,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>>,
    DefaultizedProps<TimezoneProps, 'timezone'> {
  autoFocus?: boolean;
  className?: string;
  currentMonth: TDate;
  selectedDays: (TDate | null)[];
  onSelectedDaysChange: PickerOnChangeFn<TDate>;
  disabled?: boolean;
  focusedDay: TDate | null;
  isMonthSwitchingAnimating: boolean;
  onFocusedDayChange: (newFocusedDay: TDate) => void;
  onMonthSwitchingAnimationEnd: () => void;
  readOnly?: boolean;
  reduceAnimations: boolean;
  slideDirection: SlideDirection;
  TransitionProps?: Partial<SlideTransitionProps>;
  hasFocus?: boolean;
  onFocusedViewChange?: (newHasFocus: boolean) => void;
  gridLabelId?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DayCalendarClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DayCalendarSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DayCalendarSlotProps<TDate>;
}

const useUtilityClasses = (ownerState: DayCalendarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    header: ['header'],
    weekDayLabel: ['weekDayLabel'],
    loadingContainer: ['loadingContainer'],
    slideTransition: ['slideTransition'],
    monthContainer: ['monthContainer'],
    weekContainer: ['weekContainer'],
    weekNumberLabel: ['weekNumberLabel'],
    weekNumber: ['weekNumber'],
  };

  return composeClasses(slots, getDayCalendarUtilityClass, classes);
};

const weeksContainerHeight = (DAY_SIZE + DAY_MARGIN * 2) * 6;

const PickersCalendarDayRoot = styled('div', {
  name: 'MuiDayCalendar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});

const PickersCalendarDayHeader = styled('div', {
  name: 'MuiDayCalendar',
  slot: 'Header',
  overridesResolver: (_, styles) => styles.header,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const PickersCalendarWeekDayLabel = styled(Typography, {
  name: 'MuiDayCalendar',
  slot: 'WeekDayLabel',
  overridesResolver: (_, styles) => styles.weekDayLabel,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
}));

const PickersCalendarWeekNumberLabel = styled(Typography, {
  name: 'MuiDayCalendar',
  slot: 'WeekNumberLabel',
  overridesResolver: (_, styles) => styles.weekNumberLabel,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.disabled,
}));

const PickersCalendarWeekNumber = styled(Typography, {
  name: 'MuiDayCalendar',
  slot: 'WeekNumber',
  overridesResolver: (_, styles) => styles.weekNumber,
})(({ theme }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  padding: 0,
  margin: `0 ${DAY_MARGIN}px`,
  color: theme.palette.text.disabled,
  fontSize: '0.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-flex',
}));

const PickersCalendarLoadingContainer = styled('div', {
  name: 'MuiDayCalendar',
  slot: 'LoadingContainer',
  overridesResolver: (_, styles) => styles.loadingContainer,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: weeksContainerHeight,
});

const PickersCalendarSlideTransition = styled(PickersSlideTransition, {
  name: 'MuiDayCalendar',
  slot: 'SlideTransition',
  overridesResolver: (_, styles) => styles.slideTransition,
})({
  minHeight: weeksContainerHeight,
});

const PickersCalendarWeekContainer = styled('div', {
  name: 'MuiDayCalendar',
  slot: 'MonthContainer',
  overridesResolver: (_, styles) => styles.monthContainer,
})({ overflow: 'hidden' });

const PickersCalendarWeek = styled('div', {
  name: 'MuiDayCalendar',
  slot: 'WeekContainer',
  overridesResolver: (_, styles) => styles.weekContainer,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

function WrappedDay<TDate extends PickerValidDate>({
  parentProps,
  day,
  focusableDay,
  selectedDays,
  isDateDisabled,
  currentMonthNumber,
  isViewFocused,
  ...other
}: Pick<PickersDayProps<TDate>, 'onFocus' | 'onBlur' | 'onKeyDown' | 'onDaySelect'> & {
  parentProps: DayCalendarProps<TDate>;
  day: TDate;
  focusableDay: TDate | null;
  selectedDays: TDate[];
  isDateDisabled: (date: TDate | null) => boolean;
  currentMonthNumber: number;
  isViewFocused: boolean;
}) {
  const {
    disabled,
    disableHighlightToday,
    isMonthSwitchingAnimating,
    showDaysOutsideCurrentMonth,
    slots,
    slotProps,
    timezone,
  } = parentProps;

  const utils = useUtils<TDate>();
  const now = useNow<TDate>(timezone);

  const isFocusableDay = focusableDay !== null && utils.isSameDay(day, focusableDay);
  const isSelected = selectedDays.some((selectedDay) => utils.isSameDay(selectedDay, day));
  const isToday = utils.isSameDay(day, now);

  const Day = slots?.day ?? PickersDay;
  // We don't want to pass to ownerState down, to avoid re-rendering all the day whenever a prop changes.
  const { ownerState: dayOwnerState, ...dayProps } = useSlotProps({
    elementType: Day,
    externalSlotProps: slotProps?.day,
    additionalProps: {
      disableHighlightToday,
      showDaysOutsideCurrentMonth,
      role: 'gridcell',
      isAnimating: isMonthSwitchingAnimating,
      // it is used in date range dragging logic by accessing `dataset.timestamp`
      'data-timestamp': utils.toJsDate(day).valueOf(),
      ...other,
    },
    ownerState: { ...parentProps, day, selected: isSelected },
  });

  const isDisabled = React.useMemo(
    () => disabled || isDateDisabled(day),
    [disabled, isDateDisabled, day],
  );

  const outsideCurrentMonth = React.useMemo(
    () => utils.getMonth(day) !== currentMonthNumber,
    [utils, day, currentMonthNumber],
  );

  const isFirstVisibleCell = React.useMemo(() => {
    const startOfMonth = utils.startOfMonth(utils.setMonth(day, currentMonthNumber));
    if (!showDaysOutsideCurrentMonth) {
      return utils.isSameDay(day, startOfMonth);
    }
    return utils.isSameDay(day, utils.startOfWeek(startOfMonth));
  }, [currentMonthNumber, day, showDaysOutsideCurrentMonth, utils]);

  const isLastVisibleCell = React.useMemo(() => {
    const endOfMonth = utils.endOfMonth(utils.setMonth(day, currentMonthNumber));
    if (!showDaysOutsideCurrentMonth) {
      return utils.isSameDay(day, endOfMonth);
    }
    return utils.isSameDay(day, utils.endOfWeek(endOfMonth));
  }, [currentMonthNumber, day, showDaysOutsideCurrentMonth, utils]);

  return (
    <Day
      {...dayProps}
      day={day}
      disabled={isDisabled}
      autoFocus={isViewFocused && isFocusableDay}
      today={isToday}
      outsideCurrentMonth={outsideCurrentMonth}
      isFirstVisibleCell={isFirstVisibleCell}
      isLastVisibleCell={isLastVisibleCell}
      selected={isSelected}
      tabIndex={isFocusableDay ? 0 : -1}
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
    />
  );
}

/**
 * @ignore - do not document.
 */
export function DayCalendar<TDate extends PickerValidDate>(inProps: DayCalendarProps<TDate>) {
  const props = useThemeProps({ props: inProps, name: 'MuiDayCalendar' });
  const utils = useUtils<TDate>();

  const {
    onFocusedDayChange,
    className,
    currentMonth,
    selectedDays,
    focusedDay,
    loading,
    onSelectedDaysChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    slideDirection,
    TransitionProps,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    dayOfWeekFormatter = (date) => utils.format(date, 'weekdayShort').charAt(0).toUpperCase(),
    hasFocus,
    onFocusedViewChange,
    gridLabelId,
    displayWeekNumber,
    fixedWeekNumber,
    autoFocus,
    timezone,
  } = props;

  const now = useNow<TDate>(timezone);
  const classes = useUtilityClasses(props);
  const isRtl = useRtl();

  const isDateDisabled = useIsDateDisabled({
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    timezone,
  });

  const translations = usePickersTranslations<TDate>();

  const [internalHasFocus, setInternalHasFocus] = useControlled({
    name: 'DayCalendar',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus ?? false,
  });

  const [internalFocusedDay, setInternalFocusedDay] = React.useState<TDate>(
    () => focusedDay || now,
  );

  const handleDaySelect = useEventCallback((day: TDate) => {
    if (readOnly) {
      return;
    }

    onSelectedDaysChange(day);
  });

  const focusDay = (day: TDate) => {
    if (!isDateDisabled(day)) {
      onFocusedDayChange(day);
      setInternalFocusedDay(day);

      onFocusedViewChange?.(true);
      setInternalHasFocus(true);
    }
  };

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, day: TDate) => {
      switch (event.key) {
        case 'ArrowUp':
          focusDay(utils.addDays(day, -7));
          event.preventDefault();
          break;
        case 'ArrowDown':
          focusDay(utils.addDays(day, 7));
          event.preventDefault();
          break;
        case 'ArrowLeft': {
          const newFocusedDayDefault = utils.addDays(day, isRtl ? 1 : -1);
          const nextAvailableMonth = utils.addMonths(day, isRtl ? 1 : -1);

          const closestDayToFocus = findClosestEnabledDate({
            utils,
            date: newFocusedDayDefault,
            minDate: isRtl ? newFocusedDayDefault : utils.startOfMonth(nextAvailableMonth),
            maxDate: isRtl ? utils.endOfMonth(nextAvailableMonth) : newFocusedDayDefault,
            isDateDisabled,
            timezone,
          });
          focusDay(closestDayToFocus || newFocusedDayDefault);
          event.preventDefault();
          break;
        }
        case 'ArrowRight': {
          const newFocusedDayDefault = utils.addDays(day, isRtl ? -1 : 1);
          const nextAvailableMonth = utils.addMonths(day, isRtl ? -1 : 1);

          const closestDayToFocus = findClosestEnabledDate({
            utils,
            date: newFocusedDayDefault,
            minDate: isRtl ? utils.startOfMonth(nextAvailableMonth) : newFocusedDayDefault,
            maxDate: isRtl ? newFocusedDayDefault : utils.endOfMonth(nextAvailableMonth),
            isDateDisabled,
            timezone,
          });
          focusDay(closestDayToFocus || newFocusedDayDefault);
          event.preventDefault();
          break;
        }
        case 'Home':
          focusDay(utils.startOfWeek(day));
          event.preventDefault();
          break;
        case 'End':
          focusDay(utils.endOfWeek(day));
          event.preventDefault();
          break;
        case 'PageUp':
          focusDay(utils.addMonths(day, 1));
          event.preventDefault();
          break;
        case 'PageDown':
          focusDay(utils.addMonths(day, -1));
          event.preventDefault();
          break;
        default:
          break;
      }
    },
  );

  const handleFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>, day: TDate) =>
    focusDay(day),
  );
  const handleBlur = useEventCallback((event: React.FocusEvent<HTMLButtonElement>, day: TDate) => {
    if (internalHasFocus && utils.isSameDay(internalFocusedDay, day)) {
      onFocusedViewChange?.(false);
    }
  });

  const currentMonthNumber = utils.getMonth(currentMonth);
  const currentYearNumber = utils.getYear(currentMonth);
  const validSelectedDays = React.useMemo(
    () => selectedDays.filter((day): day is TDate => !!day).map((day) => utils.startOfDay(day)),
    [utils, selectedDays],
  );

  // need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = `${currentYearNumber}-${currentMonthNumber}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slideNodeRef = React.useMemo(() => React.createRef<HTMLDivElement>(), [transitionKey]);
  const startOfCurrentWeek = utils.startOfWeek(now);

  const focusableDay = React.useMemo<TDate | null>(() => {
    const startOfMonth = utils.startOfMonth(currentMonth);
    const endOfMonth = utils.endOfMonth(currentMonth);
    if (
      isDateDisabled(internalFocusedDay) ||
      utils.isAfterDay(internalFocusedDay, endOfMonth) ||
      utils.isBeforeDay(internalFocusedDay, startOfMonth)
    ) {
      return findClosestEnabledDate({
        utils,
        date: internalFocusedDay,
        minDate: startOfMonth,
        maxDate: endOfMonth,
        disablePast,
        disableFuture,
        isDateDisabled,
        timezone,
      });
    }
    return internalFocusedDay;
  }, [
    currentMonth,
    disableFuture,
    disablePast,
    internalFocusedDay,
    isDateDisabled,
    utils,
    timezone,
  ]);

  const weeksToDisplay = React.useMemo(() => {
    const currentMonthWithTimezone = utils.setTimezone(currentMonth, timezone);
    const toDisplay = utils.getWeekArray(currentMonthWithTimezone);
    let nextMonth = utils.addMonths(currentMonthWithTimezone, 1);
    while (fixedWeekNumber && toDisplay.length < fixedWeekNumber) {
      const additionalWeeks = utils.getWeekArray(nextMonth);
      const hasCommonWeek = utils.isSameDay(
        toDisplay[toDisplay.length - 1][0],
        additionalWeeks[0][0],
      );

      additionalWeeks.slice(hasCommonWeek ? 1 : 0).forEach((week) => {
        if (toDisplay.length < fixedWeekNumber) {
          toDisplay.push(week);
        }
      });

      nextMonth = utils.addMonths(nextMonth, 1);
    }
    return toDisplay;
  }, [currentMonth, fixedWeekNumber, utils, timezone]);

  return (
    <PickersCalendarDayRoot role="grid" aria-labelledby={gridLabelId} className={classes.root}>
      <PickersCalendarDayHeader role="row" className={classes.header}>
        {displayWeekNumber && (
          <PickersCalendarWeekNumberLabel
            variant="caption"
            role="columnheader"
            aria-label={translations.calendarWeekNumberHeaderLabel}
            className={classes.weekNumberLabel}
          >
            {translations.calendarWeekNumberHeaderText}
          </PickersCalendarWeekNumberLabel>
        )}
        {getWeekdays(utils, now).map((weekday, i) => (
          <PickersCalendarWeekDayLabel
            key={i.toString()}
            variant="caption"
            role="columnheader"
            aria-label={utils.format(utils.addDays(startOfCurrentWeek, i), 'weekday')}
            className={classes.weekDayLabel}
          >
            {dayOfWeekFormatter(weekday)}
          </PickersCalendarWeekDayLabel>
        ))}
      </PickersCalendarDayHeader>

      {loading ? (
        <PickersCalendarLoadingContainer className={classes.loadingContainer}>
          {renderLoading()}
        </PickersCalendarLoadingContainer>
      ) : (
        <PickersCalendarSlideTransition
          transKey={transitionKey}
          onExited={onMonthSwitchingAnimationEnd}
          reduceAnimations={reduceAnimations}
          slideDirection={slideDirection}
          className={clsx(className, classes.slideTransition)}
          {...TransitionProps}
          nodeRef={slideNodeRef}
        >
          <PickersCalendarWeekContainer
            data-mui-test="pickers-calendar"
            ref={slideNodeRef}
            role="rowgroup"
            className={classes.monthContainer}
          >
            {weeksToDisplay.map((week, index) => (
              <PickersCalendarWeek
                role="row"
                key={`week-${week[0]}`}
                className={classes.weekContainer}
                // fix issue of announcing row 1 as row 2
                // caused by week day labels row
                aria-rowindex={index + 1}
              >
                {displayWeekNumber && (
                  <PickersCalendarWeekNumber
                    className={classes.weekNumber}
                    role="rowheader"
                    aria-label={translations.calendarWeekNumberAriaLabelText(
                      utils.getWeekNumber(week[0]),
                    )}
                  >
                    {translations.calendarWeekNumberText(utils.getWeekNumber(week[0]))}
                  </PickersCalendarWeekNumber>
                )}
                {week.map((day, dayIndex) => (
                  <WrappedDay
                    key={(day as any).toString()}
                    parentProps={props}
                    day={day}
                    selectedDays={validSelectedDays}
                    focusableDay={focusableDay}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onDaySelect={handleDaySelect}
                    isDateDisabled={isDateDisabled}
                    currentMonthNumber={currentMonthNumber}
                    isViewFocused={internalHasFocus}
                    // fix issue of announcing column 1 as column 2 when `displayWeekNumber` is enabled
                    aria-colindex={dayIndex + 1}
                  />
                ))}
              </PickersCalendarWeek>
            ))}
          </PickersCalendarWeekContainer>
        </PickersCalendarSlideTransition>
      )}
    </PickersCalendarDayRoot>
  );
}
