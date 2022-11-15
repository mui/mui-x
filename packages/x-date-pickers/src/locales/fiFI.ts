import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { DateView } from '../internals/models';

const views = {
  hours: 'tunnit',
  minutes: 'minuutit',
  seconds: 'sekuntit',
};

const viewTranslation = {
  calendar: 'kalenteri',
  clock: 'kello',
};

const fiFIPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Edellinen kuukausi',
  nextMonth: 'Seuraava kuukausi',

  // View navigation
  openPreviousView: 'avaa edellinen kuukausi',
  openNextView: 'avaa seuraava kuukausi',
  calendarViewSwitchingButtonAriaLabel: (view: DateView) =>
    view === 'year'
      ? 'vuosinäkymä on auki, vaihda kalenterinäkymään'
      : 'kalenterinäkymä on auki, vaihda vuosinäkymään',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
    isKeyboardInputOpen
      ? `tekstikenttä on auki, mene ${viewTranslation[viewType]}näkymään`
      : `${viewTranslation[viewType]}näkymä on auki, mene tekstikenttään`,

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
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const fiFI = getPickersLocalization(fiFIPickers);
