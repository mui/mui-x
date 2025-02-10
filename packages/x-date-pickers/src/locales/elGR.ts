import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'ώρες',
  minutes: 'λεπτά',
  seconds: 'δευτερόλεπτα',
  meridiem: 'μεσημβρία',
};

const elGRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Προηγούμενος μήνας',
  nextMonth: 'Επόμενος μήνας',

  // View navigation
  openPreviousView: 'Άνοίγμα προηγούμενης προβολή',
  openNextView: 'Άνοίγμα επόμενης προβολή',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'η προβολή έτους είναι ανοιχτή, μεταβείτε στην προβολή ημερολογίου'
      : 'η προβολή ημερολογίου είναι ανοιχτή, μεταβείτε στην προβολή έτους',

  // DateRange labels
  start: 'Αρχή',
  end: 'Τέλος',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

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
  clockLabelText: (view, formattedTime) =>
    `Επιλέξτε ${views[view]}. ${!formattedTime ? 'Δεν έχει επιλεγεί ώρα' : `Η επιλεγμένη ώρα είναι ${formattedTime}`}`,
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
  openDatePickerDialogue: (formattedDate) =>
    formattedDate
      ? `Επιλέξτε ημερομηνία, η επιλεγμένη ημερομηνία είναι ${formattedDate}`
      : 'Επιλέξτε ημερομηνία',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Επιλέξτε ώρα, η επιλεγμένη ώρα είναι ${formattedTime}` : 'Επιλέξτε ώρα',
  // fieldClearLabel: 'Clear',

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

  // View names
  year: 'Χρόνος',
  month: 'Μήνας',
  day: 'Ημέρα',
  weekDay: 'Καθημερινή',
  hours: 'Ώρες',
  minutes: 'Λεπτά',
  seconds: 'Δευτερόλεπτα',
  meridiem: 'Προ Μεσημβρίας',

  // Common
  // empty: 'Empty',
};

export const elGR = getPickersLocalization(elGRPickers);
