import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { DateView } from '../internals/models';

const views = {
  hours: '시간을',
  minutes: '분을',
  seconds: '초를',
};

const koKRPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: '이전 달',
  nextMonth: '다음 달',

  // View navigation
  openPreviousView: '이전 화면 보기',
  openNextView: '다음 화면 보기',
  calendarViewSwitchingButtonAriaLabel: (view: DateView) =>
    view === 'year'
      ? '연도 선택 화면에서 달력 화면으로 전환하기'
      : '달력 화면에서 연도 선택 화면으로 전환하기',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: '시작',
  end: '종료',

  // Action bar
  cancelButtonLabel: '취소',
  clearButtonLabel: '초기화',
  okButtonLabel: '확인',
  todayButtonLabel: '오늘',

  // Toolbar titles
  // datePickerToolbarTitle: 'Select date',
  // dateTimePickerToolbarTitle: 'Select date & time',
  // timePickerToolbarTitle: 'Select time',
  // dateRangePickerToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${views[view]} 선택하세요. ${
      time === null
        ? '시간을 선택하지 않았습니다.'
        : `현재 선택된 시간은 ${adapter.format(time, 'fullTime')}입니다.`
    }`,
  hoursClockNumberText: (hours) => `${hours}시간`,
  minutesClockNumberText: (minutes) => `${minutes}분`,
  secondsClockNumberText: (seconds) => `${seconds}초`,

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `날짜를 선택하세요. 현재 선택된 날짜는 ${utils.format(value, 'fullDate')}입니다.`
      : '날짜를 선택하세요',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `시간을 선택하세요. 현재 선택된 시간은 ${utils.format(value, 'fullTime')}입니다.`
      : '시간을 선택하세요',

  // Table labels
  timeTableLabel: '선택한 시간',
  dateTableLabel: '선택한 날짜',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const koKR = getPickersLocalization(koKRPickers);
