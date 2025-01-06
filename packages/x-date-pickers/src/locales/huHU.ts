import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'Óra',
  minutes: 'Perc',
  seconds: 'Másodperc',
  meridiem: 'Délután',
};

const huHUPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Előző hónap',
  nextMonth: 'Következő hónap',

  // View navigation
  openPreviousView: 'Előző nézet megnyitása',
  openNextView: 'Következő nézet megnyitása',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'az évválasztó már nyitva, váltson a naptárnézetre'
      : 'a naptárnézet már nyitva, váltson az évválasztóra',

  // DateRange labels
  start: 'Kezdő dátum',
  end: 'Záró dátum',
  startDate: 'Kezdő dátum',
  startTime: 'Kezdő idő',
  endDate: 'Záró dátum',
  endTime: 'Záró idő',

  // Action bar
  cancelButtonLabel: 'Mégse',
  clearButtonLabel: 'Törlés',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Ma',

  // Toolbar titles
  datePickerToolbarTitle: 'Dátum kiválasztása',
  dateTimePickerToolbarTitle: 'Dátum és idő kiválasztása',
  timePickerToolbarTitle: 'Idő kiválasztása',
  dateRangePickerToolbarTitle: 'Dátumhatárok kiválasztása',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view] ?? view} kiválasztása. ${!formattedTime ? 'Nincs kiválasztva idő' : `A kiválasztott idő ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} ${timeViews.hours.toLowerCase()}`,
  minutesClockNumberText: (minutes) => `${minutes} ${timeViews.minutes.toLowerCase()}`,
  secondsClockNumberText: (seconds) => `${seconds}  ${timeViews.seconds.toLowerCase()}`,

  // Digital clock labels
  selectViewText: (view) => `${timeViews[view]} kiválasztása`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Hét',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber}. hét`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate
      ? `Válasszon dátumot, a kiválasztott dátum: ${formattedDate}`
      : 'Válasszon dátumot',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Válasszon időt, a kiválasztott idő: ${formattedTime}` : 'Válasszon időt',
  fieldClearLabel: 'Tartalom ürítése',

  // Table labels
  timeTableLabel: 'válasszon időt',
  dateTableLabel: 'válasszon dátumot',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'É'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'HHHH' : 'HH'),
  fieldDayPlaceholder: () => 'NN',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'NNNN' : 'NN'),
  fieldHoursPlaceholder: () => 'óó',
  fieldMinutesPlaceholder: () => 'pp',
  fieldSecondsPlaceholder: () => 'mm',
  fieldMeridiemPlaceholder: () => 'dd',

  // View names
  year: 'Év',
  month: 'Hónap',
  day: 'Nap',
  weekDay: 'Hétköznap',
  hours: timeViews.hours,
  minutes: timeViews.minutes,
  seconds: timeViews.seconds,
  meridiem: timeViews.meridiem,

  // Common
  empty: 'Üres',
};

export const huHU = getPickersLocalization(huHUPickers);
