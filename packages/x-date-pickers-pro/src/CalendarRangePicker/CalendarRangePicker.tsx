import * as React from 'react';
import clsx from 'clsx';
import useEventCallback from '@mui/utils/useEventCallback';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { Watermark } from '@mui/x-license-pro';
import {
  applyDefaultDate,
  BaseDateValidationProps,
  DAY_MARGIN,
  DayPicker,
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
} from '@mui/x-date-pickers/internals';
import { getReleaseInfo } from '../internal/utils/releaseInfo';
import { getCalendarRangePickerUtilityClass } from './calendarRangePickerClasses';
import {
  CalendarRangePickerProps,
  CalendarRangePickerDefaultizedProps,
} from './CalendarRangePicker.types';
import {
  isEndOfRange,
  isRangeValid,
  isStartOfRange,
  isWithinRange,
} from '../internal/utils/date-utils';
import { calculateRangeChange, calculateRangePreview } from '../DateRangePicker/date-range-manager';
import { DateRange } from '../internal/models';
import { DateRangePickerDay } from '../DateRangePickerDay';

const releaseInfo = getReleaseInfo();

const CalendarRangePickerRoot = styled('div', {
  name: 'MuiCalendarRangePicker',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'row',
});

const CalendarRangePickerMonthContainer = styled('div', {
  name: 'MuiCalendarRangePicker',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

const CalendarRangePickerArrowSwitcher = styled(PickersArrowSwitcher)({
  padding: '16px 16px 8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const DAY_RANGE_SIZE = 40;
const weeksContainerHeight = (DAY_RANGE_SIZE + DAY_MARGIN * 2) * 6;

const CalendarRangeDayPicker = styled(DayPicker)({
  minWidth: 312,
  minHeight: weeksContainerHeight,
}) as typeof DayPicker;

function useCalendarRangePickerDefaultizedProps<TDate>(
  props: CalendarRangePickerProps<TDate>,
  name: string,
): CalendarRangePickerDefaultizedProps<TDate> {
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
  };
}

const useUtilityClasses = (ownerState: CalendarRangePickerProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    container: ['container'],
  };

  return composeClasses(slots, getCalendarRangePickerUtilityClass, classes);
};

export function CalendarRangePicker<TDate>(inProps: CalendarRangePickerProps<TDate>) {
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();

  // TODO: Add theme augmentation
  const props = useCalendarRangePickerDefaultizedProps(inProps, 'MuiCalendarRangePicker');

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  const isMobile = React.useContext(WrapperVariantContext) === 'mobile';

  const {
    className,
    value,
    onChange,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    shouldDisableDate,
    reduceAnimations,
    onMonthChange,
    defaultCalendarMonth,
    currentDatePosition,
    onCurrentDatePositionChange,
    calendars,
    components,
    componentsProps,
    loading,
    renderLoading,
    disableHighlightToday,
    readOnly,
    disabled,
    renderDay = (_, dateRangeProps) => <DateRangePickerDay {...dateRangeProps} />,
    showDaysOutsideCurrentMonth,
    dayOfWeekFormatter,
  } = props;

  const wrappedShouldDisableDate =
    shouldDisableDate &&
    ((dayToTest: TDate) => shouldDisableDate?.(dayToTest, currentDatePosition));

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

  const handleSelectedDayChange = useEventCallback((newDate: TDate | null) => {
    const { nextSelection, newRange } = calculateRangeChange({
      newDate,
      utils,
      range: value,
      currentlySelectingRangeEnd: currentDatePosition,
    });

    onCurrentDatePositionChange(nextSelection);

    const isFullRangeSelected = currentDatePosition === 'end' && isRangeValid(utils, newRange);

    onChange(newRange as DateRange<TDate>, isFullRangeSelected ? 'finish' : 'partial');
  });

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
    range: value,
    newDate: rangePreviewDay,
    currentlySelectingRangeEnd: currentDatePosition,
  });

  const handlePreviewDayChange = (newPreviewRequest: TDate) => {
    if (!isWithinRange(utils, newPreviewRequest, value)) {
      setRangePreviewDay(newPreviewRequest);
    } else {
      setRangePreviewDay(null);
    }
  };

  return (
    <CalendarRangePickerRoot className={clsx(className, classes.root)}>
      <Watermark packageName="x-date-pickers-pro" releaseInfo={releaseInfo} />
      {Array.from({ length: calendars }).map((_, index) => {
        const monthOnIteration = utils.setMonth(
          calendarState.currentMonth,
          utils.getMonth(calendarState.currentMonth) + index,
        );

        return (
          <CalendarRangePickerMonthContainer key={index} className={classes.container}>
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
              <CalendarRangePickerArrowSwitcher
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
                {utils.format(monthOnIteration, 'monthAndYear')}
              </CalendarRangePickerArrowSwitcher>
            )}
            <CalendarRangeDayPicker<TDate>
              key={index}
              {...calendarState}
              {...baseDateValidationProps}
              {...commonViewProps}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={changeFocusedDay}
              reduceAnimations={reduceAnimations}
              selectedDays={value}
              onSelectedDaysChange={handleSelectedDayChange}
              currentMonth={monthOnIteration}
              TransitionProps={CalendarTransitionProps}
              shouldDisableDate={wrappedShouldDisableDate}
              showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
              dayOfWeekFormatter={dayOfWeekFormatter}
              loading={loading}
              renderLoading={renderLoading}
              renderDay={(day, __, DayProps) =>
                renderDay(day, {
                  isPreviewing: isMobile ? false : isWithinRange(utils, day, previewingRange),
                  isStartOfPreviewing: isMobile
                    ? false
                    : isStartOfRange(utils, day, previewingRange),
                  isEndOfPreviewing: isMobile ? false : isEndOfRange(utils, day, previewingRange),
                  isHighlighting: isWithinRange(utils, day, value),
                  isStartOfHighlighting: isStartOfRange(utils, day, value),
                  isEndOfHighlighting: isEndOfRange(utils, day, value),
                  onMouseEnter: () => handlePreviewDayChange(day),
                  ...DayProps,
                })
              }
            />
          </CalendarRangePickerMonthContainer>
        );
      })}
    </CalendarRangePickerRoot>
  );
}
