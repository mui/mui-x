"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.koKR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: '시간을',
    minutes: '분을',
    seconds: '초를',
    meridiem: '오전/오후를',
};
var koKRPickers = {
    // Calendar navigation
    previousMonth: '이전 달',
    nextMonth: '다음 달',
    // View navigation
    openPreviousView: '이전 화면 보기',
    openNextView: '다음 화면 보기',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? '연도 선택 화면에서 달력 화면으로 전환하기'
            : '달력 화면에서 연도 선택 화면으로 전환하기';
    },
    // DateRange labels
    start: '시작',
    end: '종료',
    startDate: '시작 날짜',
    startTime: '시작 시간',
    endDate: '종료 날짜',
    endTime: '종료 시간',
    // Action bar
    cancelButtonLabel: '취소',
    clearButtonLabel: '초기화',
    okButtonLabel: '확인',
    todayButtonLabel: '오늘',
    nextStepButtonLabel: '다음',
    // Toolbar titles
    datePickerToolbarTitle: '날짜 선택하기',
    dateTimePickerToolbarTitle: '날짜 & 시간 선택하기',
    timePickerToolbarTitle: '시간 선택하기',
    dateRangePickerToolbarTitle: '날짜 범위 선택하기',
    timeRangePickerToolbarTitle: '시간 범위 선택하기',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "".concat(views[view], " \uC120\uD0DD\uD558\uC138\uC694. ").concat(!formattedTime ? '시간을 선택하지 않았습니다.' : "\uD604\uC7AC \uC120\uD0DD\uB41C \uC2DC\uAC04\uC740 ".concat(formattedTime, "\uC785\uB2C8\uB2E4."));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, "\uC2DC"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, "\uBD84"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, "\uCD08"); },
    // Digital clock labels
    selectViewText: function (view) { return "".concat(views[view], " \uC120\uD0DD\uD558\uAE30"); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: '주 번호',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "".concat(weekNumber, "\uBC88\uC9F8 \uC8FC"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "\uB0A0\uC9DC\uB97C \uC120\uD0DD\uD558\uC138\uC694. \uD604\uC7AC \uC120\uD0DD\uB41C \uB0A0\uC9DC\uB294 ".concat(formattedDate, "\uC785\uB2C8\uB2E4.")
            : '날짜를 선택하세요';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime
            ? "\uC2DC\uAC04\uC744 \uC120\uD0DD\uD558\uC138\uC694. \uD604\uC7AC \uC120\uD0DD\uB41C \uC2DC\uAC04\uC740 ".concat(formattedTime, "\uC785\uB2C8\uB2E4.")
            : '시간을 선택하세요';
    },
    openRangePickerDialogue: function (formattedRange) {
        return formattedRange
            ? "\uBC94\uC704\uB97C \uC120\uD0DD\uD558\uC138\uC694. \uD604\uC7AC \uC120\uD0DD\uB41C \uBC94\uC704\uB294 ".concat(formattedRange, "\uC785\uB2C8\uB2E4.")
            : '범위를 선택하세요';
    },
    fieldClearLabel: '지우기',
    // Table labels
    timeTableLabel: '선택한 시간',
    dateTableLabel: '선택한 날짜',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Y'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: '년',
    month: '월',
    day: '일',
    weekDay: '평일',
    hours: '시간',
    minutes: '분',
    seconds: '초',
    meridiem: '오전/오후',
    // Common
    empty: '공란',
};
exports.koKR = (0, getPickersLocalization_1.getPickersLocalization)(koKRPickers);
