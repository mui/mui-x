"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zhTW = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: '小時',
    minutes: '分鐘',
    seconds: '秒',
    meridiem: '十二小時制',
};
var zhTWPickers = {
    // Calendar navigation
    previousMonth: '上個月',
    nextMonth: '下個月',
    // View navigation
    openPreviousView: '前一個視圖',
    openNextView: '下一個視圖',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year' ? '年視圖已打開，切換為日曆視圖' : '日曆視圖已打開，切換為年視圖';
    },
    // DateRange labels
    start: '開始',
    end: '結束',
    startDate: '開始日期',
    startTime: '開始時間',
    endDate: '結束日期',
    endTime: '結束時間',
    // Action bar
    cancelButtonLabel: '取消',
    clearButtonLabel: '清除',
    okButtonLabel: '確認',
    todayButtonLabel: '今天',
    nextStepButtonLabel: '下個',
    // Toolbar titles
    datePickerToolbarTitle: '選擇日期',
    dateTimePickerToolbarTitle: '選擇日期和時間',
    timePickerToolbarTitle: '選擇時間',
    dateRangePickerToolbarTitle: '選擇日期範圍',
    timeRangePickerToolbarTitle: '選擇時間範圍',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u9078\u64C7 ".concat(views[view], ". ").concat(!formattedTime ? '未選擇時間' : "\u5DF2\u9078\u64C7".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, "\u5C0F\u6642"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, "\u5206\u9418"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, "\u79D2"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u9078\u64C7 ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: '週數',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u7B2C".concat(weekNumber, "\u9031"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u9078\u64C7\u65E5\u671F\uFF0C\u5DF2\u9078\u64C7".concat(formattedDate) : '選擇日期';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u9078\u64C7\u6642\u9593\uFF0C\u5DF2\u9078\u64C7".concat(formattedTime) : '選擇時間';
    },
    openRangePickerDialogue: function (formattedRange) {
        return formattedRange ? "\u9078\u64C7\u7BC4\u570D\uFF0C\u5DF2\u9078\u64C7\u7684\u7BC4\u570D\u662F ".concat(formattedRange) : '選擇範圍';
    },
    fieldClearLabel: '清除',
    // Table labels
    timeTableLabel: '選擇時間',
    dateTableLabel: '選擇日期',
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
    year: '年份',
    month: '月份',
    day: '日期',
    weekDay: '星期',
    hours: '時',
    minutes: '分',
    seconds: '秒',
    meridiem: '十二小時制',
    // Common
    empty: '空',
};
exports.zhTW = (0, getPickersLocalization_1.getPickersLocalization)(zhTWPickers);
