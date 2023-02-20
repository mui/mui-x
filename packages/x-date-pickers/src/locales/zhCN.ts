import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const views = {
  hours: '小时',
  minutes: '分钟',
  seconds: '秒',
};

const zhCNPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: '上个月',
  nextMonth: '下个月',

  // View navigation
  openPreviousView: '前一个视图',
  openNextView: '下一个视图',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year' ? '年视图已打开，切换为日历视图' : '日历视图已打开，切换为年视图',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: '开始',
  end: '结束',

  // Action bar
  cancelButtonLabel: '取消',
  clearButtonLabel: '清除',
  okButtonLabel: '确认',
  todayButtonLabel: '今天',

  // Toolbar titles
  // datePickerDefaultToolbarTitle: 'Select date',
  // dateTimePickerDefaultToolbarTitle: 'Select date & time',
  // timePickerDefaultToolbarTitle: 'Select time',
  // dateRangePickerDefaultToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${views[view]}. ${
      time === null ? '未选择时间' : `已选择${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours}小时`,
  minutesClockNumberText: (minutes) => `${minutes}分钟`,
  secondsClockNumberText: (seconds) => `${seconds}秒`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `选择日期，已选择${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : '选择日期',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `选择时间，已选择${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : '选择时间',

  // Table labels
  timeTableLabel: '选择时间',
  dateTableLabel: '选择日期',
};

export const zhCN = getPickersLocalization(zhCNPickers);
