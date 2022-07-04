import { CalendarPickerView, ClockPickerView, MuiPickersAdapter } from '../../internals/models';
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
}

export type PickersTranslationKeys = keyof PickersLocaleText<any>;
