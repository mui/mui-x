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

const srLatnPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Prethodni mesec',
  nextMonth: 'Sledeći mesec',

  // View navigation
  openPreviousView: 'Otvori prethodni prikaz',
  openNextView: 'Otvori sledeći prikaz',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'Otvoren je godišnji prikaz, promeni na kalendarski prikaz'
      : 'Otvoren je kalendarski prikaz, promeni na godišnji prikaz',

  // DateRange labels
  start: 'Početak',
  end: 'Kraj',
  startDate: 'Početni datum',
  startTime: 'Početno vreme',
  endDate: 'Krajnji datum',
  endTime: 'Krajnje vreme',

  // Action bar
  cancelButtonLabel: 'Otkaži',
  clearButtonLabel: 'Obriši',
  okButtonLabel: 'U redu',
  todayButtonLabel: 'Danas',
  nextStepButtonLabel: 'Sledeći',

  // Toolbar titles
  datePickerToolbarTitle: 'Izaberi datum',
  dateTimePickerToolbarTitle: 'Izaberi datum i vreme',
  timePickerToolbarTitle: 'Izaberi vreme',
  dateRangePickerToolbarTitle: 'Izaberi vremenski opseg',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Izaberi ${timeViews[view] ?? view}. ${!formattedTime ? 'Vreme nije izabrano' : `Izabrano vreme je ${formattedTime}`}`,
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
  selectViewText: (view) => `Izaberi ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Broj nedelje',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Nedelja ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Izaberi datum, izabrani datum je ${formattedDate}` : 'Izaberi datum',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Izaberi vreme, izabrano vreme je ${formattedTime}` : 'Izaberi vreme',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Obriši',

  // Table labels
  timeTableLabel: 'Izaberi vreme',
  dateTableLabel: 'Izaberi datum',

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
  month: 'Mesec',
  day: 'Dan',
  weekDay: 'Dan u nedelji',
  hours: 'Sati',
  minutes: 'Minute',
  seconds: 'Sekunde',
  meridiem: 'Meridiem',

  // Common
  empty: 'Isprazni',
};

export const srLatn = getPickersLocalization(srLatnPickers);
