import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'godzin',
  minutes: 'minut',
  seconds: 'sekund',
  meridiem: 'popołudnie',
};

const plPLPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Poprzedni miesiąc',
  nextMonth: 'Następny miesiąc',

  // View navigation
  openPreviousView: 'Otwórz poprzedni widok',
  openNextView: 'Otwórz następny widok',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'otwarty jest widok roku, przełącz na widok kalendarza'
      : 'otwarty jest widok kalendarza, przełącz na widok roku',

  // DateRange labels
  start: 'Początek',
  end: 'Koniec',
  startDate: 'Data rozpoczęcia',
  startTime: 'Czas rozpoczęcia',
  endDate: 'Data zakończenia',
  endTime: 'Czas zakończenia',

  // Action bar
  cancelButtonLabel: 'Anuluj',
  clearButtonLabel: 'Wyczyść',
  okButtonLabel: 'Zatwierdź',
  todayButtonLabel: 'Dzisiaj',
  // nextStepButtonLabel: 'Next',

  // Toolbar titles
  datePickerToolbarTitle: 'Wybierz datę',
  dateTimePickerToolbarTitle: 'Wybierz datę i czas',
  timePickerToolbarTitle: 'Wybierz czas',
  dateRangePickerToolbarTitle: 'Wybierz zakres dat',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Wybierz ${timeViews[view]}. ${!formattedTime ? 'Nie wybrano czasu' : `Wybrany czas to ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} godzin`,
  minutesClockNumberText: (minutes) => `${minutes} minut`,
  secondsClockNumberText: (seconds) => `${seconds} sekund`,

  // Digital clock labels
  selectViewText: (view) => `Wybierz ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Numer tygodnia',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Tydzień ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Wybierz datę, obecnie wybrana data to ${formattedDate}` : 'Wybierz datę',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Wybierz czas, obecnie wybrany czas to ${formattedTime}` : 'Wybierz czas',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Wyczyść',

  // Table labels
  timeTableLabel: 'wybierz czas',
  dateTableLabel: 'wybierz datę',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Rok',
  month: 'Miesiąc',
  day: 'Dzień',
  weekDay: 'Dzień tygodnia',
  hours: 'Godzin',
  minutes: 'Minut',
  seconds: 'Sekund',
  // meridiem: 'Meridiem',

  // Common
  // empty: 'Empty',
};

export const plPL = getPickersLocalization(plPLPickers);
