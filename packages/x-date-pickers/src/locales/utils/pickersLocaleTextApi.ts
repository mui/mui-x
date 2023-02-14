import {
  CalendarPickerView,
  ClockPickerView,
  MuiPickersAdapter,
  ViewType,
} from '../../internals/models';
/**
 * Set the types of the texts in the grid.
 */
export interface PickersLocaleText<TDate> {
  previousMonth: string;
  nextMonth: string;
  openPreviousView: string;
  openNextView: string;
  cancelButtonLabel: string;
  clearButtonLabel: string;
  okButtonLabel: string;
  todayButtonLabel: string;
  start: string;
  end: string;
  calendarViewSwitchingButtonAriaLabel: (currentView: CalendarPickerView) => string;
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: ViewType) => string;
  clockLabelText: (
    view: ClockPickerView,
    time: TDate | null,
    adapter: MuiPickersAdapter<TDate>,
  ) => string;
  hoursClockNumberText: (hours: string) => string;
  minutesClockNumberText: (minutes: string) => string;
  secondsClockNumberText: (seconds: string) => string;
  openDatePickerDialogue: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
  openTimePickerDialogue: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
  timeTableLabel: string;
  dateTableLabel: string;
  datePickerDefaultToolbarTitle: string;
  dateTimePickerDefaultToolbarTitle: string;
  timePickerDefaultToolbarTitle: string;
  dateRangePickerDefaultToolbarTitle: string;
}

export type PickersTranslationKeys = keyof PickersLocaleText<any>;
