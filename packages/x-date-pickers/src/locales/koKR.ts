import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

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
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? '연도 선택 화면에서 달력 화면으로 전환하기'
      : '달력 화면에서 연도 선택 화면으로 전환하기',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `텍스트 입력 화면에서 ${viewType} 화면으로 전환하기`
      : `${viewType} 화면에서 텍스트 입력 화면으로 전환하기`,

  // DateRange placeholders
  start: '시작',
  end: '종료',

  // Action bar
  cancelButtonLabel: '취소',
  clearButtonLabel: '초기화',
  okButtonLabel: '확인',
  todayButtonLabel: '오늘',

  // Toolbar titles
  datePickerDefaultToolbarTitle: '날짜 선택하기',
  dateTimePickerDefaultToolbarTitle: '날짜 & 시간 선택하기',
  timePickerDefaultToolbarTitle: '시간 선택하기',
  dateRangePickerDefaultToolbarTitle: '날짜 범위 선택하기',

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

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `날짜를 선택하세요. 현재 선택된 날짜는 ${utils.format(
          utils.date(rawValue)!,
          'fullDate',
        )}입니다.`
      : '날짜를 선택하세요',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `시간을 선택하세요. 현재 선택된 시간은 ${utils.format(
          utils.date(rawValue)!,
          'fullTime',
        )}입니다.`
      : '시간을 선택하세요',

  // Table labels
  timeTableLabel: '선택한 시간',
  dateTableLabel: '선택한 날짜',
};

export const koKR = getPickersLocalization(koKRPickers);
