import { CalendarPickerView, ClockPickerView, MuiPickersAdapter } from '../../internals/models';
/**
 * Set the types of the texts in the grid.
 */
export interface PickersLocaleText<TDate> {
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
  calendarViewSwitchingButtonAriaLabel: (currentView: CalendarPickerView) => string;
  inputModeToggleButtonAriaLabel: (
    isKeyboardInputOpen: boolean,
    viewType: 'calendar' | 'clock',
  ) => string;

  // DateRange placeholders
  start: string;
  end: string;

  // Action bar
  cancelButtonLabel: string;
  clearButtonLabel: string;
  okButtonLabel: string;
  todayButtonLabel: string;

  // Toolbar titles
  datePickerDefaultToolbarTitle: string;
  dateTimePickerDefaultToolbarTitle: string;
  timePickerDefaultToolbarTitle: string;
  dateRangePickerDefaultToolbarTitle: string;

  // Clock labels
  clockLabelText: (
    view: ClockPickerView,
    time: TDate | null,
    adapter: MuiPickersAdapter<TDate>,
  ) => string;
  hoursClockNumberText: (hours: string) => string;
  minutesClockNumberText: (minutes: string) => string;
  secondsClockNumberText: (seconds: string) => string;

  // Open picker labels
  openDatePickerDialogue: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
  openTimePickerDialogue: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;

  // Table labels
  timeTableLabel: string;
  dateTableLabel: string;

  // Field section placeholders
  fieldYearPlaceholder: (params: { digitAmount: number }) => string;
  fieldMonthPlaceholder: (params: { contentType: 'letter' | 'digit' }) => string;
  fieldDayPlaceholder: () => string;
  fieldHoursPlaceholder: () => string;
  fieldMinutesPlaceholder: () => string;
  fieldSecondsPlaceholder: () => string;
  fieldMeridiemPlaceholder: () => string;
}

export type PickersInputLocaleText<TDate> = Partial<PickersLocaleText<TDate>>;

export type PickersTranslationKeys = keyof PickersLocaleText<any>;
