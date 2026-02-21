import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'orduak',
  minutes: 'minutuak',
  seconds: 'segunduak',
  meridiem: 'meridianoa',
};

const euPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Azken hilabetea',
  nextMonth: 'Hurrengo hilabetea',

  // View navigation
  openPreviousView: 'azken bista ireki',
  openNextView: 'hurrengo bista ireki',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'urteko bista irekita dago, aldatu egutegi bistara'
      : 'egutegi bista irekita dago, aldatu urteko bistara',

  // DateRange labels
  start: 'Hasi',
  end: 'Bukatu',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Utxi',
  clearButtonLabel: 'Garbitu',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Gaur',
  nextStepButtonLabel: 'Hurrengo',

  // Toolbar titles
  datePickerToolbarTitle: 'Data aukeratu',
  dateTimePickerToolbarTitle: 'Data eta ordua aukeratu',
  timePickerToolbarTitle: 'Ordua aukeratu',
  dateRangePickerToolbarTitle: 'Data tartea aukeratu',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Aukeratu ${views[view]}. ${!formattedTime ? 'Ez da ordurik aukertau' : `Aukeratutako ordua ${formattedTime} da`}`,
  hoursClockNumberText: (hours) => `${hours} ordu`,
  minutesClockNumberText: (minutes) => `${minutes} minutu`,
  secondsClockNumberText: (seconds) => `${seconds} segundu`,

  // Digital clock labels
  selectViewText: (view) => `Aukeratu ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Astea zenbakia',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber} astea`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Data aukeratu, aukeratutako data ${formattedDate} da` : 'Data aukeratu',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Ordua aukeratu, aukeratutako ordua ${formattedTime} da` : 'Ordua aukeratu',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Balioa garbitu',

  // Table labels
  timeTableLabel: 'ordua aukeratu',
  dateTableLabel: 'data aukeratu',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),

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

export const eu = getPickersLocalization(euPickers);
