import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'ώρες',
  minutes: 'λεπτά',
  seconds: 'δευτερόλεπτα',
  meridiem: 'μεσημβρία',
};

const elGRPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Προηγούμενος μήνας',
  nextMonth: 'Επόμενος μήνας',

  // View navigation
  openPreviousView: 'ανοίγμα προηγούμενης προβολή',
  openNextView: 'ανοίγμα επόμενης προβολή',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'η προβολή έτους είναι ανοιχτή, μεταβείτε στην προβολή ημερολογίου'
      : 'η προβολή ημερολογίου είναι ανοιχτή, μεταβείτε στην προβολή έτους',

  // DateRange placeholders
  start: 'Αρχή',
  end: 'Τέλος',

  // Action bar
  cancelButtonLabel: 'Άκυρο',
  clearButtonLabel: 'Καθαρισμός',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Σήμερα',

  // Toolbar titles
  datePickerToolbarTitle: 'Επιλέξτε ημερομηνία',
  dateTimePickerToolbarTitle: 'Επιλέξτε ημερομηνία και ώρα',
  timePickerToolbarTitle: 'Επιλέξτε ώρα',
  dateRangePickerToolbarTitle: 'Επιλέξτε εύρος ημερομηνιών',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Επιλέξτε ${views[view]}. ${
      time === null
        ? 'Δεν έχει επιλεγεί ώρα'
        : `Η επιλεγμένη ώρα είναι ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ώρες`,
  minutesClockNumberText: (minutes) => `${minutes} λεπτά`,
  secondsClockNumberText: (seconds) => `${seconds} δευτερόλεπτα`,

  // Digital clock labels
  selectViewText: (view) => `Επιλέξτε ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Αριθμός εβδομάδας',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Εβδομάδα ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Επιλέξτε ημερομηνία, η επιλεγμένη ημερομηνία είναι ${utils.format(value, 'fullDate')}`
      : 'Επιλέξτε ημερομηνία',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Επιλέξτε ώρα, η επιλεγμένη ώρα είναι ${utils.format(value, 'fullTime')}`
      : 'Επιλέξτε ώρα',

  // Table labels
  timeTableLabel: 'επιλέξτε ώρα',
  dateTableLabel: 'επιλέξτε ημερομηνία',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const elGR = getPickersLocalization(elGRPickers);
