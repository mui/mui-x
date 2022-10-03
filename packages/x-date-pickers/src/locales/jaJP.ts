import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const jaJPPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: '先月',
  nextMonth: '来月',

  // View navigation
  openPreviousView: '前の画面を開く',
  openNextView: '次の画面を開く',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? '年選択画面からカレンダー画面に切り替える'
      : 'カレンダー画面から年選択画面に切り替える',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: '開始',
  end: '終了',

  // Action bar
  cancelButtonLabel: 'キャンセル',
  clearButtonLabel: 'クリア',
  okButtonLabel: '確認',
  todayButtonLabel: '今日',

  // Toolbar titles
  // datePickerDefaultToolbarTitle: 'Select date',
  // dateTimePickerDefaultToolbarTitle: 'Select date & time',
  // timePickerDefaultToolbarTitle: 'Select time',
  // dateRangePickerDefaultToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null
        ? '時間が選択されていません'
        : `選択した時間は ${adapter.format(time, 'fullTime')} です`
    }`,
  hoursClockNumberText: (hours) => `${hours} 時間`,
  minutesClockNumberText: (minutes) => `${minutes} 分`,
  secondsClockNumberText: (seconds) => `${seconds} 秒`,

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
};

export const jaJP = getPickersLocalization(jaJPPickers);
