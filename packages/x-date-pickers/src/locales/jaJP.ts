import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

// maps ClockPickerView to its translation
const clockViews = {
  hours: '時間',
  minutes: '分',
  seconds: '秒',
};

// maps PickersToolbar["viewType"] to its translation
const pickerViews = {
  calendar: 'カレンダー表示',
  clock: '時計表示',
};

const jaJPPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: '先月',
  nextMonth: '来月',

  // View navigation
  openPreviousView: '前の表示を開く',
  openNextView: '次の表示を開く',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? '年選択表示からカレンダー表示に切り替える'
      : 'カレンダー表示から年選択表示に切り替える',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
    isKeyboardInputOpen
      ? `テキスト入力表示から${pickerViews[viewType]}に切り替える`
      : `${pickerViews[viewType]}からテキスト入力表示に切り替える`,

  // DateRange placeholders
  start: '開始',
  end: '終了',

  // Action bar
  cancelButtonLabel: 'キャンセル',
  clearButtonLabel: 'クリア',
  okButtonLabel: '確定',
  todayButtonLabel: '今日',

  // Toolbar titles
  datePickerToolbarTitle: '日付を選択',
  dateTimePickerToolbarTitle: '日時を選択',
  timePickerToolbarTitle: '時間を選択',
  dateRangePickerToolbarTitle: '日付の範囲を選択',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${clockViews[view] ?? view}を選択してください ${
      time === null
        ? '時間が選択されていません'
        : `選択した時間は ${adapter.format(time, 'fullTime')} です`
    }`,
  hoursClockNumberText: (hours) => `${hours} ${clockViews.hours}`,
  minutesClockNumberText: (minutes) => `${minutes} ${clockViews.minutes}`,
  secondsClockNumberText: (seconds) => `${seconds} ${clockViews.seconds}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `日付を選択してください。選択した日付は ${utils.format(value, 'fullDate')} です`
      : '日付を選択してください',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `時間を選択してください。選択した時間は ${utils.format(value, 'fullTime')} です`
      : '時間を選択してください',

  // Table labels
  timeTableLabel: '時間を選択',
  dateTableLabel: '日付を選択',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const jaJP = getPickersLocalization(jaJPPickers);
