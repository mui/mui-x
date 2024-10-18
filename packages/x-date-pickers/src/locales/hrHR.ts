import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'sati',
  minutes: 'minute',
  seconds: 'sekunde',
  meridiem: 'meridiem',
};

const hrHRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Prethodni mjesec',
  nextMonth: 'Naredni mjesec',

  // View navigation
  openPreviousView: 'Otvori prethodni prikaz',
  openNextView: 'Otvori naredni prikaz',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'Otvoren je godišnji prikaz, promijeni na kalendarski prikaz'
      : 'Otvoren je kalendarski prikaz, promijeni na godišnji prikaz',

  // DateRange labels
  start: 'Početak',
  end: 'Kraj',
  startDate: 'Početni datum',
  startTime: 'Početno vrijeme',
  endDate: 'Krajnji datum',
  endTime: 'Krajnje vrijeme',

  // Action bar
  cancelButtonLabel: 'Otkaži',
  clearButtonLabel: 'Izbriši',
  okButtonLabel: 'U redu',
  todayButtonLabel: 'Danas',

  // Toolbar titles
  datePickerToolbarTitle: 'Odaberi datum',
  dateTimePickerToolbarTitle: 'Odaberi datum i vrijeme',
  timePickerToolbarTitle: 'Odaberi vrijeme',
  dateRangePickerToolbarTitle: 'Odaberi vremenski okvir',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Odaberi ${timeViews[view] ?? view}. ${!formattedTime ? 'Vrijeme nije odabrano' : `Odabrano vrijeme je ${formattedTime}`}`,
  hoursClockNumberText: (hours) => {
    let suffix = 'sati';
    if (Number(hours) === 1) {
      suffix = 'sat';
    } else if (Number(hours) < 5) {
      suffix = 'sata';
    }
    return `${hours} ${suffix}`;
  },
  minutesClockNumberText: (minutes) =>
    `${minutes} ${Number(minutes) > 1 && Number(minutes) < 5 ? 'minute' : 'minuta'}`,
  secondsClockNumberText: (seconds) => {
    let suffix = 'sekundi';
    if (Number(seconds) === 1) {
      suffix = 'sekunda';
    } else if (Number(seconds) < 5) {
      suffix = 'sekunde';
    }
    return `${seconds} ${suffix}`;
  },

  // Digital clock labels
  selectViewText: (view) => `Odaberi ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Broj tjedna',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Tjedan ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Odaberi datum, odabrani datum je ${formattedDate}` : 'Odaberi datum',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Odaberi vrijeme, odabrano vrijeme je ${formattedTime}` : 'Odaberi vrijeme',
  fieldClearLabel: 'Izbriši',

  // Table labels
  timeTableLabel: 'Odaberi vrijeme',
  dateTableLabel: 'Odaberi datum',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'G'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Godina',
  month: 'Mjesec',
  day: 'Dan',
  weekDay: 'Dan u tjednu',
  hours: 'Sati',
  minutes: 'Minute',
  seconds: 'Sekunde',
  meridiem: 'Meridiem',

  // Common
  empty: 'Isprazni',
};

export const hrHR = getPickersLocalization(hrHRPickers);
