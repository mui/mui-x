"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jaJP = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    meridiem: 'メリディム',
};
var jaJPPickers = {
    // Calendar navigation
    previousMonth: '先月',
    nextMonth: '来月',
    // View navigation
    openPreviousView: '前の表示を開く',
    openNextView: '次の表示を開く',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? '年選択表示からカレンダー表示に切り替える'
            : 'カレンダー表示から年選択表示に切り替える';
    },
    // DateRange labels
    start: '開始',
    end: '終了',
    startDate: '開始日',
    startTime: '開始時間',
    endDate: '終了日',
    endTime: '終了時間',
    // Action bar
    cancelButtonLabel: 'キャンセル',
    clearButtonLabel: 'クリア',
    okButtonLabel: '確定',
    todayButtonLabel: '今日',
    nextStepButtonLabel: '来',
    // Toolbar titles
    datePickerToolbarTitle: '日付を選択',
    dateTimePickerToolbarTitle: '日時を選択',
    timePickerToolbarTitle: '時間を選択',
    dateRangePickerToolbarTitle: '日付の範囲を選択',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, "\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 ").concat(!formattedTime ? '時間が選択されていません' : "\u9078\u629E\u3057\u305F\u6642\u9593\u306F ".concat(formattedTime, " \u3067\u3059")); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " ").concat(timeViews.hours); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " ").concat(timeViews.minutes); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " ").concat(timeViews.seconds); },
    // Digital clock labels
    selectViewText: function (view) { return "\u3092\u9078\u629E ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: '週番号',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "".concat(weekNumber, "\u9031\u76EE"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "\u65E5\u4ED8\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u9078\u629E\u3057\u305F\u65E5\u4ED8\u306F ".concat(formattedDate, " \u3067\u3059")
            : '日付を選択してください';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime
            ? "\u6642\u9593\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u9078\u629E\u3057\u305F\u6642\u9593\u306F ".concat(formattedTime, " \u3067\u3059")
            : '時間を選択してください';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'クリア',
    // Table labels
    timeTableLabel: '時間を選択',
    dateTableLabel: '日付を選択',
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
    year: '年',
    month: '月',
    day: '日',
    weekDay: '平日',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    meridiem: 'メリディム',
    // Common
    empty: '空',
};
exports.jaJP = (0, getPickersLocalization_1.getPickersLocalization)(jaJPPickers);
