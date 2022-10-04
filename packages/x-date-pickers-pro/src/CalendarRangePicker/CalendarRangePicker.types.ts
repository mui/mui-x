import {
  BaseDateValidationProps,
  DefaultizedProps,
  ExportedDayPickerProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
  PickerSelectionState,
} from '@mui/x-date-pickers/internals';
import { DateRange, DayRangeValidationProps } from '../internal/models';
import { CalendarRangePickerClasses } from './calendarRangePickerClasses';
import { DateRangePickerDayProps } from '@mui/x-date-pickers-pro';

export interface CalendarRangePickerSlotsComponent extends PickersArrowSwitcherSlotsComponent {}

export interface CalendarRangePickerSlotsComponentsProps
  extends PickersArrowSwitcherSlotsComponentsProps {}

export interface CalendarRangePickerProps<TDate>
  extends Omit<ExportedDayPickerProps<TDate>, 'renderDay'>,
    BaseDateValidationProps<TDate>,
    DayRangeValidationProps<TDate> {
  className?: string;
  classes?: Partial<CalendarRangePickerClasses>;
  value: DateRange<TDate>;
  onChange: (newValue: DateRange<TDate>, selectionState?: PickerSelectionState) => void;
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations?: boolean;
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange?: (month: TDate) => void | Promise<void>;
  /**
   * Default calendar month displayed when `value={null}`.
   */
  defaultCalendarMonth?: TDate;
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<CalendarRangePickerSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<CalendarRangePickerSlotsComponentsProps>;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom renderer for `<DateRangePicker />` days. @DateIOType
   * @example (date, dateRangePickerDayProps) => <DateRangePickerDay {...dateRangePickerDayProps} />
   * @template TDate
   * @param {TDate} day The day to render.
   * @param {DateRangePickerDayProps<TDate>} dateRangePickerDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay?: (day: TDate, dateRangePickerDayProps: DateRangePickerDayProps<TDate>) => JSX.Element;
}

export type CalendarRangePickerDefaultizedProps<TDate> = DefaultizedProps<
  CalendarRangePickerProps<TDate>,
  'reduceAnimations' | 'calendars' | keyof BaseDateValidationProps<TDate>
>;
