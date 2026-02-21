import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'klukkustundir',
  minutes: 'mínútur',
  seconds: 'sekúndur',
  meridiem: 'eftirmiðdagur',
};

const isISPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Fyrri mánuður',
  nextMonth: 'Næsti mánuður',

  // View navigation
  openPreviousView: 'Opna fyrri skoðun',
  openNextView: 'Opna næstu skoðun',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'ársskoðun er opin, skipta yfir í dagatalsskoðun'
      : 'dagatalsskoðun er opin, skipta yfir í ársskoðun',

  // DateRange labels
  start: 'Upphaf',
  end: 'Endir',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Hætta við',
  clearButtonLabel: 'Hreinsa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Í dag',
  nextStepButtonLabel: 'Næsti',

  // Toolbar titles
  datePickerToolbarTitle: 'Velja dagsetningu',
  dateTimePickerToolbarTitle: 'Velja dagsetningu og tíma',
  timePickerToolbarTitle: 'Velja tíma',
  dateRangePickerToolbarTitle: 'Velja tímabil',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Velja ${timeViews[view]}. ${!formattedTime ? 'Enginn tími valinn' : `Valinn tími er ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} klukkustundir`,
  minutesClockNumberText: (minutes) => `${minutes} mínútur`,
  secondsClockNumberText: (seconds) => `${seconds} sekúndur`,

  // Digital clock labels
  selectViewText: (view) => `Velja ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Vikunúmer',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Vika ${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Velja dagsetningu, valin dagsetning er ${formattedDate}` : 'Velja dagsetningu',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Velja tíma, valinn tími er ${formattedTime}` : 'Velja tíma',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  // fieldClearLabel: 'Clear',

  // Table labels
  timeTableLabel: 'velja tíma',
  dateTableLabel: 'velja dagsetningu',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Á'.repeat(params.digitAmount),
  fieldHoursPlaceholder: () => 'kk',
  fieldMeridiemPlaceholder: () => 'ee',

  // View names
  // year: 'Year',
  // month: 'Month',
  // day: 'Day',
  // weekDay: 'Week day',
  // hours: 'Hours',
  // minutes: 'Minutes',
  // seconds: 'Seconds',
  // meridiem: 'Meridiem',

  // Common
  // empty: 'Empty',
};

export const isIS = getPickersLocalization(isISPickers);
