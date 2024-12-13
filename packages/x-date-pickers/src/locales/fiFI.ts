import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'tunnit',
  minutes: 'minuutit',
  seconds: 'sekuntit',
  meridiem: 'iltapäivä',
};

const fiFIPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Edellinen kuukausi',
  nextMonth: 'Seuraava kuukausi',

  // View navigation
  openPreviousView: 'Avaa edellinen näkymä',
  openNextView: 'Avaa seuraava näkymä',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'vuosinäkymä on auki, vaihda kalenterinäkymään'
      : 'kalenterinäkymä on auki, vaihda vuosinäkymään',

  // DateRange labels
  start: 'Alku',
  end: 'Loppu',
  startDate: 'Alkamispäivämäärä',
  startTime: 'Alkamisaika',
  endDate: 'Päättymispäivämäärä',
  endTime: 'Päättymisaika',

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
  clockLabelText: (view, formattedTime) =>
    `Valitse ${views[view]}. ${!formattedTime ? 'Ei aikaa valittuna' : `Valittu aika on ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} tuntia`,
  minutesClockNumberText: (minutes) => `${minutes} minuuttia`,
  secondsClockNumberText: (seconds) => `${seconds} sekuntia`,

  // Digital clock labels
  selectViewText: (view) => `Valitse ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Viikko',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Viikko ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Valitse päivä, valittu päivä on ${formattedDate}` : 'Valitse päivä',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Valitse aika, valittu aika on ${formattedTime}` : 'Valitse aika',
  fieldClearLabel: 'Tyhjennä arvo',

  // Table labels
  timeTableLabel: 'valitse aika',
  dateTableLabel: 'valitse päivä',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'V'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'KKKK' : 'KK'),
  fieldDayPlaceholder: () => 'PP',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'tt',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Vuosi',
  month: 'Kuukausi',
  day: 'Päivä',
  weekDay: 'Viikonpäivä',
  hours: 'Tunnit',
  minutes: 'Minuutit',
  seconds: 'Sekunnit',
  meridiem: 'Iltapäivä',

  // Common
  empty: 'Tyhjä',
};

export const fiFI = getPickersLocalization(fiFIPickers);
