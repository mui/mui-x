import { TimeViewWithMeridiem } from '../../internals/models';
import {
  DateView,
  TimeView,
  MuiPickersAdapter,
  FieldSectionContentType,
  PickerValidDate,
} from '../../models';

export interface PickersComponentSpecificLocaleText {
  /**
   * Title displayed in the toolbar of the `DatePicker` and its variants.
   * Will be overridden by the `toolbarTitle` translation key passed directly on the picker.
   */
  datePickerToolbarTitle: string;
  /**
   * Title displayed in the toolbar of the `TimePicker` and its variants.
   * Will be overridden by the `toolbarTitle` translation key passed directly on the picker.
   */
  timePickerToolbarTitle: string;
  /**
   * Title displayed in the toolbar of the `DateTimePicker` and its variants.
   * Will be overridden by the `toolbarTitle` translation key passed directly on the picker.
   */
  dateTimePickerToolbarTitle: string;
  /**
   * Title displayed in the toolbar of the `DateRangePicker` and its variants.
   * Will be overridden by the `toolbarTitle` translation key passed directly on the picker.
   */
  dateRangePickerToolbarTitle: string;
}

export interface PickersComponentAgnosticLocaleText<TDate extends PickerValidDate> {
  // Calendar navigation
  previousMonth: string;
  nextMonth: string;

  // Calendar week number
  calendarWeekNumberHeaderLabel: string;
  calendarWeekNumberHeaderText: string;
  calendarWeekNumberAriaLabelText: (weekNumber: number) => string;
  calendarWeekNumberText: (weekNumber: number) => string;

  // View navigation
  openPreviousView: string;
  openNextView: string;
  calendarViewSwitchingButtonAriaLabel: (currentView: DateView) => string;

  // DateRange labels
  start: string;
  end: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;

  // Action bar
  cancelButtonLabel: string;
  clearButtonLabel: string;
  okButtonLabel: string;
  todayButtonLabel: string;

  // Clock labels
  clockLabelText: (view: TimeView, time: TDate | null, adapter: MuiPickersAdapter<TDate>) => string;
  hoursClockNumberText: (hours: string) => string;
  minutesClockNumberText: (minutes: string) => string;
  secondsClockNumberText: (seconds: string) => string;

  // Digital clock labels
  selectViewText: (view: TimeViewWithMeridiem) => string;

  // Open picker labels
  openDatePickerDialogue: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
  openTimePickerDialogue: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;

  // Clear button label
  fieldClearLabel: string;

  // Table labels
  timeTableLabel: string;
  dateTableLabel: string;

  // Field section placeholders
  fieldYearPlaceholder: (params: { digitAmount: number; format: string }) => string;
  fieldMonthPlaceholder: (params: {
    contentType: FieldSectionContentType;
    format: string;
  }) => string;
  fieldDayPlaceholder: (params: { format: string }) => string;
  fieldWeekDayPlaceholder: (params: {
    contentType: FieldSectionContentType;
    format: string;
  }) => string;
  fieldHoursPlaceholder: (params: { format: string }) => string;
  fieldMinutesPlaceholder: (params: { format: string }) => string;
  fieldSecondsPlaceholder: (params: { format: string }) => string;
  fieldMeridiemPlaceholder: (params: { format: string }) => string;

  // View names - reflects available `FieldSectionType` options
  year: string;
  month: string;
  day: string;
  weekDay: string;
  hours: string;
  minutes: string;
  seconds: string;
  meridiem: string;

  // Common
  empty: string;
}

export interface PickersLocaleText<TDate extends PickerValidDate>
  extends PickersComponentAgnosticLocaleText<TDate>,
    PickersComponentSpecificLocaleText {}

export type PickersInputLocaleText<TDate extends PickerValidDate> = Partial<
  PickersLocaleText<TDate>
>;

/**
 * Translations that can be provided directly to the picker components.
 * It contains some generic translations like `toolbarTitle`
 * which will be dispatched to various translations keys in `PickersLocaleText`, depending on the pickers received them.
 */
export interface PickersInputComponentLocaleText<TDate extends PickerValidDate>
  extends Partial<PickersComponentAgnosticLocaleText<TDate>> {
  /**
   * Title displayed in the toolbar of this picker.
   * Will override the global translation keys like `datePickerToolbarTitle` passed to the `LocalizationProvider`.
   */
  toolbarTitle?: string;
}

export type PickersTranslationKeys = keyof PickersLocaleText<any>;

export type LocalizedComponent<
  TDate extends PickerValidDate,
  Props extends { localeText?: PickersInputComponentLocaleText<TDate> },
> = Omit<Props, 'localeText'> & { localeText?: PickersInputLocaleText<TDate> };
