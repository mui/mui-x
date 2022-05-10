import * as React from 'react';
import {
  PickersCalendarHeader,
  ExportedCalendarHeaderProps,
  useDefaultDates,
  useUtils,
  ExportedDateValidationProps,
  DayPicker,
  DayPickerProps,
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { doNothing } from '../internal/utils/utils';
import { DateRange } from '../internal/models/dateRange';
import { DateRangePickerDay } from '../DateRangePickerDay';
import { ExportedDesktopDateRangeCalendarProps } from './DateRangePickerViewDesktop';
import { isWithinRange, isStartOfRange, isEndOfRange } from '../internal/utils/date-utils';

export interface DateRangePickerViewMobileSlotsComponent
  extends PickersCalendarHeaderSlotsComponent {}

export interface DateRangePickerViewMobileSlotsComponentsProps
  extends PickersCalendarHeaderSlotsComponentsProps {}

export interface ExportedMobileDateRangeCalendarProps<TDate>
  extends Pick<ExportedDesktopDateRangeCalendarProps<TDate>, 'renderDay'> {}

interface DesktopDateRangeCalendarProps<TDate>
  extends ExportedMobileDateRangeCalendarProps<TDate>,
    Omit<DayPickerProps<TDate>, 'selectedDays' | 'renderDay' | 'onFocusedDayChange'>,
    ExportedDateValidationProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: Partial<DateRangePickerViewMobileSlotsComponent>;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps?: Partial<DateRangePickerViewMobileSlotsComponentsProps>;
  parsedValue: DateRange<TDate>;
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
    parsedValue,
    leftArrowButtonText,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onSelectedDaysChange,
    renderDay = (_, dayProps) => <DateRangePickerDay<TDate> {...dayProps} />,
    rightArrowButtonText,
    disabled,
    readOnly,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  // When disable, limit the view to the selected range
  const [start, end] = parsedValue;
  const minDateWithDisabled = (disabled && start) || minDate;
  const maxDateWithDisabled = (disabled && end) || maxDate;

  return (
    <React.Fragment>
      <PickersCalendarHeader
        components={components}
        componentsProps={componentsProps}
        leftArrowButtonText={leftArrowButtonText}
        maxDate={maxDateWithDisabled}
        minDate={minDateWithDisabled}
        onMonthChange={changeMonth as any}
        openView="day"
        rightArrowButtonText={rightArrowButtonText}
        views={onlyDayView}
        disabled={disabled}
        {...other}
      />
      <DayPicker<TDate>
        {...other}
        disabled={disabled}
        readOnly={readOnly}
        selectedDays={parsedValue}
        onSelectedDaysChange={onSelectedDaysChange}
        onFocusedDayChange={doNothing}
        renderDay={(day, _, DayProps) =>
          renderDay(day, {
            isPreviewing: false,
            isStartOfPreviewing: false,
            isEndOfPreviewing: false,
            isHighlighting: isWithinRange(utils, day, parsedValue),
            isStartOfHighlighting: isStartOfRange(utils, day, parsedValue),
            isEndOfHighlighting: isEndOfRange(utils, day, parsedValue),
            ...DayProps,
          })
        }
      />
    </React.Fragment>
  );
}
