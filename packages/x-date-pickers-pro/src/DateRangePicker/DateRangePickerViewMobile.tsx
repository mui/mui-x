import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import {
  PickersCalendarHeader,
  ExportedCalendarHeaderProps,
  useDefaultDates,
  useUtils,
  DayPicker,
  DayPickerProps,
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
  DayValidationProps,
  DayPickerSlotsComponent,
  DayPickerSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { doNothing } from '../internal/utils/utils';
import { DateRange } from '../internal/models/dateRange';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';
import { isWithinRange, isStartOfRange, isEndOfRange } from '../internal/utils/date-utils';

export interface DateRangePickerViewMobileSlotsComponent<TDate>
  extends PickersCalendarHeaderSlotsComponent,
    Omit<DayPickerSlotsComponent<TDate>, 'Day'> {
  Day?: React.ElementType<DateRangePickerDayProps<TDate>>;
}

export interface DateRangePickerViewMobileSlotsComponentsProps<TDate>
  extends PickersCalendarHeaderSlotsComponentsProps,
    DayPickerSlotsComponentsProps<TDate> {}

interface DesktopDateRangeCalendarProps<TDate>
  extends Omit<
      DayPickerProps<TDate>,
      'selectedDays' | 'onFocusedDayChange' | 'classes' | 'components' | 'componentsProps'
    >,
    DayValidationProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<DateRangePickerViewMobileSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DateRangePickerViewMobileSlotsComponentsProps<TDate>>;
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

  const componentsFromDayPicker = {
    Day: DateRangePickerDay,
    ...components,
  } as Partial<DayPickerSlotsComponent<TDate>>;

  const componentsPropsForDayPicker = {
    ...componentsProps,
    day: (dayOwnerState) => {
      const { day } = dayOwnerState;

      return {
        isPreviewing: false,
        isStartOfPreviewing: false,
        isEndOfPreviewing: false,
        isHighlighting: isWithinRange(utils, day, value),
        isStartOfHighlighting: isStartOfRange(utils, day, value),
        isEndOfHighlighting: isEndOfRange(utils, day, value),
        ...(resolveComponentProps(componentsProps?.day, dayOwnerState) ?? {}),
      };
    },
  } as Partial<DayPickerSlotsComponentsProps<TDate>>;

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
      <DayPicker<TDate>
        {...other}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        readOnly={readOnly}
        selectedDays={value}
        onSelectedDaysChange={onSelectedDaysChange}
        onFocusedDayChange={doNothing}
        components={componentsFromDayPicker}
        componentsProps={componentsPropsForDayPicker}
      />
    </React.Fragment>
  );
}
