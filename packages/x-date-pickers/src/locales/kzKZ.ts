import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// Translation map for Clock Label
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'Сағатты',
  minutes: 'Минутты',
  seconds: 'Секундты',
  meridiem: 'Меридием',
};

const kzKZPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Алдыңғы ай',
  nextMonth: 'Келесі ай',

  // View navigation
  openPreviousView: 'Алдыңғы көріністі ашу',
  openNextView: 'Келесі көріністі ашу',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'жылдық көріністі ашу, күнтізбе көрінісіне ауысу'
      : 'күнтізбе көрінісін ашу, жылдық көрінісіне ауысу',

  // DateRange labels
  start: 'Бастау',
  end: 'Cоңы',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Бас тарту',
  clearButtonLabel: 'Тазарту',
  okButtonLabel: 'Ок',
  todayButtonLabel: 'Бүгін',

  // Toolbar titles
  datePickerToolbarTitle: 'Күнді таңдау',
  dateTimePickerToolbarTitle: 'Күн мен уақытты таңдау',
  timePickerToolbarTitle: 'Уақытты таңдау',
  dateRangePickerToolbarTitle: 'Кезеңді таңдаңыз',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view]} таңдау. ${!formattedTime ? 'Уақыт таңдалмаған' : `Таңдалған уақыт ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} сағат`,
  minutesClockNumberText: (minutes) => `${minutes} минут`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Digital clock labels
  selectViewText: (view) => `${timeViews[view]} таңдау`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Апта нөмірі',
  calendarWeekNumberHeaderText: '№',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Апта ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Күнді таңдаңыз, таңдалған күн ${formattedDate}` : 'Күнді таңдаңыз',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Уақытты таңдаңыз, таңдалған уақыт ${formattedTime}` : 'Уақытты таңдаңыз',
  // fieldClearLabel: 'Clear',

  // Table labels
  timeTableLabel: 'уақытты таңдау',
  dateTableLabel: 'күнді таңдау',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Ж'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'AAAA' : 'AA'),
  fieldDayPlaceholder: () => 'КК',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
  fieldHoursPlaceholder: () => 'сс',
  fieldMinutesPlaceholder: () => 'мм',
  fieldSecondsPlaceholder: () => 'сс',
  fieldMeridiemPlaceholder: () => '(т|к)',

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

export const kzKZ = getPickersLocalization(kzKZPickers);
