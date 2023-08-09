import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'tunnit',
  minutes: 'minuutit',
  seconds: 'sekuntit',
  meridiem: 'iltapäivä',
};

const fiFIPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Edellinen kuukausi',
  nextMonth: 'Seuraava kuukausi',

  // View navigation
  openPreviousView: 'avaa edellinen kuukausi',
  openNextView: 'avaa seuraava kuukausi',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'vuosinäkymä on auki, vaihda kalenterinäkymään'
      : 'kalenterinäkymä on auki, vaihda vuosinäkymään',

  // DateRange placeholders
  start: 'Alku',
  end: 'Loppu',

  // Action bar
  cancelButtonLabel: 'Peruuta',
  clearButtonLabel: 'Tyhjennä',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Tänään',

  // Toolbar titles
  datePickerToolbarTitle: 'Valitse päivä',
  dateTimePickerToolbarTitle: 'Valitse päivä ja aika',
  timePickerToolbarTitle: 'Valitse aika',
  dateRangePickerToolbarTitle: 'Valitse aikaväli',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Valitse ${views[view]}. ${
      time === null ? 'Ei aikaa valittuna' : `Valittu aika on ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} tuntia`,
  minutesClockNumberText: (minutes) => `${minutes} minuuttia`,
  secondsClockNumberText: (seconds) => `${seconds} sekunttia`,

  // Digital clock labels
  selectViewText: (view) => `Valitse ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Viikko',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Viikko ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Valitse päivä, valittu päivä on ${utils.format(value, 'fullDate')}`
      : 'Valitse päivä',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Valitse aika, valittu aika on ${utils.format(value, 'fullTime')}`
      : 'Valitse aika',

  // Table labels
  timeTableLabel: 'valitse aika',
  dateTableLabel: 'valitse päivä',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const fiFI = getPickersLocalization(fiFIPickers);
