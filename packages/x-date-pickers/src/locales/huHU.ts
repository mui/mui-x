import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const huHPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Előző hónap',
  nextMonth: 'Következő hónap',

  // View navigation
  openPreviousView: 'Előző nézet megnyitása',
  openNextView: 'Következő nézet megnyitása',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'az év választó már nyitva, válts a naptár nézetre'
      : 'a naptár nézet már nyitva, válts az év-választóra',

  // DateRange placeholders
  start: 'Kezdet',
  end: 'Vég',

  // Action bar
  cancelButtonLabel: 'Mégse',
  clearButtonLabel: 'Törlés',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Ma',

  // Toolbar titles
  datePickerToolbarTitle: 'Dátum kiválasztása',
  dateTimePickerToolbarTitle: 'Dátum és idő kiválasztása',
  timePickerToolbarTitle: 'Idő kiválasztása',
  dateRangePickerToolbarTitle: 'Dátum határok kiválasztása',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${view} kiválasztása. ${
      time === null ? 'Nincs idő kiválasztva' : `A kiválasztott idő ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} óra`,
  minutesClockNumberText: (minutes) => `${minutes} perc`,
  secondsClockNumberText: (seconds) => `${seconds} másodperc`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Hét',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber}. hét`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Válassz dátumot, a kiválasztott dátum: ${utils.format(value, 'fullDate')}`
      : 'Válassz dátumot',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Válassz időt, a kiválasztott idő: ${utils.format(value, 'fullTime')}`
      : 'Válassz időt',

  // Table labels
  timeTableLabel: 'válassz időt',
  dateTableLabel: 'válassz dátumot',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'É'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'HHHH' : 'HH'),
  fieldDayPlaceholder: () => 'NN',
  fieldHoursPlaceholder: () => 'óó',
  fieldMinutesPlaceholder: () => 'pp',
  fieldSecondsPlaceholder: () => 'mm',
  fieldMeridiemPlaceholder: () => 'dd',
};

export const huH = getPickersLocalization(huHPickers);
