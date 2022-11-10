import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

// This object is not Partial<PickersLocaleText> because it is the default values

const ukUAPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Попередній місяць',
  nextMonth: 'Наступний місяць',

  // View navigation
  openPreviousView: 'відкрити попередній вигляд',
  openNextView: 'відкрити наступний вигляд',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'річний вигляд відкрито, перейти до календарного вигляду'
      : 'календарний вигляд відкрито, перейти до річного вигляду',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
    isKeyboardInputOpen
      ? `текстове поле відкрите, перейти до  ${viewType} вигляду`
      : `${viewType} вигляд наразі відкрито, перейти до текстового поля`,

  // DateRange placeholders
  start: 'Початок',
  end: 'Кінець',

  // Action bar
  cancelButtonLabel: 'Відміна',
  clearButtonLabel: 'Очистити',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Сьогодні',

  // Toolbar titles
  datePickerToolbarTitle: 'Вибрати дату',
  dateTimePickerToolbarTitle: 'Вибрати дату і час',
  timePickerToolbarTitle: 'Вибрати час',
  dateRangePickerToolbarTitle: 'Вибрати календарний період',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Час не вибраний' : `Вибрано час ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} годин`,
  minutesClockNumberText: (minutes) => `${minutes} хвилин`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Оберіть дату, обрана дата  ${utils.format(value, 'fullDate')}`
      : 'Оберіть дату',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Оберіть час, обраний час  ${utils.format(value, 'fullTime')}`
      : 'Оберіть час',

  // Table labels
  timeTableLabel: 'оберіть час',
  dateTableLabel: 'оберіть дату',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const ukUA = getPickersLocalization(ukUAPickers);
