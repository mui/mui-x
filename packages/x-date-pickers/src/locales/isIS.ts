import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const isISPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Fyrri mánuður',
  nextMonth: 'Næsti mánuður',

  // View navigation
  openPreviousView: 'opna fyrri skoðun',
  openNextView: 'opna næstu skoðun',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'ársskoðun er opin, skipta yfir í dagatalsskoðun'
      : 'dagatalsskoðun er opin, skipta yfir í ársskoðun',

  // DateRange placeholders
  start: 'Upphaf',
  end: 'Endir',

  // Action bar
  cancelButtonLabel: 'Hætta við',
  clearButtonLabel: 'Hreinsa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Í dag',

  // Toolbar titles
  datePickerToolbarTitle: 'Velja dagsetningu',
  dateTimePickerToolbarTitle: 'Velja dagsetningu og tíma',
  timePickerToolbarTitle: 'Velja tíma',
  dateRangePickerToolbarTitle: 'Velja tímabil',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Enginn tími valinn' : `Valinn tími er ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} klukkustundir`,
  minutesClockNumberText: (minutes) => `${minutes} mínútur`,
  secondsClockNumberText: (seconds) => `${seconds} sekúndur`,

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Velja dagsetningu, valin dagsetning er ${utils.format(value, 'fullDate')}`
      : 'Velja dagsetningu',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Velja tíma, valinn tími er ${utils.format(value, 'fullTime')}`
      : 'Velja tíma',

  // Table labels
  timeTableLabel: 'velja tíma',
  dateTableLabel: 'velja dagsetningu',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const isIS = getPickersLocalization(isISPickers);
