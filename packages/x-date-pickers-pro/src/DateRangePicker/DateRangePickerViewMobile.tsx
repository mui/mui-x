import * as React from 'react';
import { resolveComponentProps, SlotComponentProps } from '@mui/base/utils';
import {
  PickersCalendarHeader,
  ExportedCalendarHeaderProps,
  useDefaultDates,
  useUtils,
  DayCalendar,
  DayCalendarProps,
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
  DayValidationProps,
  DayCalendarSlotsComponent,
  DayCalendarSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { doNothing } from '../internal/utils/utils';
import { DateRange } from '../internal/models/range';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';

import { isWithinRange, isStartOfRange, isEndOfRange } from '../internal/utils/date-utils';

export interface DateRangePickerViewMobileSlotsComponent<TDate>
  extends PickersCalendarHeaderSlotsComponent,
    Omit<DayCalendarSlotsComponent<TDate>, 'Day'> {
  /**
   * Custom component for day in range pickers.
   * Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component.
   * @default DateRangePickersDay
   */
  Day?: React.ElementType<DateRangePickerDayProps<TDate>>;
}

export interface DateRangePickerViewMobileSlotsComponentsProps<TDate>
  extends PickersCalendarHeaderSlotsComponentsProps<TDate>,
    Omit<DayCalendarSlotsComponentsProps<TDate>, 'day'> {
  day?: SlotComponentProps<typeof DateRangePickerDay, {}, DayCalendarProps<TDate> & { day: TDate }>;
}

interface DesktopDateRangeCalendarProps<TDate>
  extends Omit<
      DayCalendarProps<TDate>,
      'selectedDays' | 'onFocusedDayChange' | 'classes' | 'components' | 'componentsProps'
    >,
    DayValidationProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DateRangePickerViewMobileSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateRangePickerViewMobileSlotsComponentsProps<TDate>;
  value: DateRange<TDate>;
  changeMonth: (date: TDate) => void;
}

const onlyDayView = ['day'] as const;

/**
 * @ignore - internal component.
 */
export function DateRangePickerViewMobile<TDate>(props: DesktopDateRangeCalendarProps<TDate>) {
  const {
    changeMonth,
    components,
    componentsProps,
    value,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onSelectedDaysChange,
    disabled,
    readOnly,
    // excluding classes from `other` to avoid passing them down to children
    classes: providedClasses,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  // When disable, limit the view to the selected range
  const [start, end] = value;
  const minDateWithDisabled = (disabled && start) || minDate;
  const maxDateWithDisabled = (disabled && end) || maxDate;

  const componentsForDayCalendar = {
    Day: DateRangePickerDay,
    ...components,
  } as DayCalendarSlotsComponent<TDate>;

  // Range going for the start of the start day to the end of the end day.
  // This makes sure that `isWithinRange` works with any time in the start and end day.
  const valueDayRange = React.useMemo<DateRange<TDate>>(
    () => [
      value[0] == null || !utils.isValid(value[0]) ? value[0] : utils.startOfDay(value[0]),
      value[1] == null || !utils.isValid(value[1]) ? value[1] : utils.endOfDay(value[1]),
    ],
    [value, utils],
  );

  const componentsPropsForDayCalendar = {
    ...componentsProps,
    day: (dayOwnerState) => {
      const { day } = dayOwnerState;

      return {
        isPreviewing: false,
        isStartOfPreviewing: false,
        isEndOfPreviewing: false,
        isHighlighting: isWithinRange(utils, day, valueDayRange),
        isStartOfHighlighting: isStartOfRange(utils, day, valueDayRange),
        isEndOfHighlighting: isEndOfRange(utils, day, valueDayRange),
        ...(resolveComponentProps(componentsProps?.day, dayOwnerState) ?? {}),
      };
    },
  } as DayCalendarSlotsComponentsProps<TDate>;

  return (
    <React.Fragment>
      <PickersCalendarHeader
        components={components}
        componentsProps={componentsProps}
        maxDate={maxDateWithDisabled}
        minDate={minDateWithDisabled}
        onMonthChange={changeMonth as any}
        openView="day"
        views={onlyDayView}
        disabled={disabled}
        {...other}
      />
      <DayCalendar<TDate>
        {...other}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        readOnly={readOnly}
        selectedDays={value}
        onSelectedDaysChange={onSelectedDaysChange}
        onFocusedDayChange={doNothing}
        components={componentsForDayCalendar}
        componentsProps={componentsPropsForDayCalendar}
      />
    </React.Fragment>
  );
}
