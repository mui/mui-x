import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'uren',
  minutes: 'minuten',
  seconds: 'seconden',
  meridiem: 'meridium',
};

const nlNLPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Vorige maand',
  nextMonth: 'Volgende maand',

  // View navigation
  openPreviousView: 'Open vorige view',
  openNextView: 'Open volgende view',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'jaarweergave is geopend, schakel over naar kalenderweergave'
      : 'kalenderweergave is geopend, switch naar jaarweergave',

  // DateRange labels
  start: 'Start',
  end: 'Einde',
  startDate: 'Startdatum',
  startTime: 'Starttijd',
  endDate: 'Einddatum',
  endTime: 'Eindtijd',

  // Action bar
  cancelButtonLabel: 'Annuleren',
  clearButtonLabel: 'Resetten',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Vandaag',

  // Toolbar titles
  datePickerToolbarTitle: 'Selecteer datum',
  dateTimePickerToolbarTitle: 'Selecteer datum & tijd',
  timePickerToolbarTitle: 'Selecteer tijd',
  dateRangePickerToolbarTitle: 'Selecteer datumbereik',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Selecteer ${timeViews[view]}. ${!formattedTime ? 'Geen tijd geselecteerd' : `Geselecteerde tijd is ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} uren`,
  minutesClockNumberText: (minutes) => `${minutes} minuten`,
  secondsClockNumberText: (seconds) => `${seconds} seconden`,

  // Digital clock labels
  selectViewText: (view) => `Selecteer ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Weeknummer',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Week ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Kies datum, geselecteerde datum is ${formattedDate}` : 'Kies datum',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Kies tijd, geselecteerde tijd is ${formattedTime}` : 'Kies tijd',
  fieldClearLabel: 'Wissen',

  // Table labels
  timeTableLabel: 'kies tijd',
  dateTableLabel: 'kies datum',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'J'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'uu',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Jaar',
  month: 'Maand',
  day: 'Dag',
  weekDay: 'Weekdag',
  hours: 'Uren',
  minutes: 'Minuten',
  seconds: 'Seconden',
  meridiem: 'Middag',

  // Common
  empty: 'Leeg',
};

export const nlNL = getPickersLocalization(nlNLPickers);
