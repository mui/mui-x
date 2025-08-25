"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zhCN = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    meridiem: '十二小时制',
};
var zhCNPickers = {
    // Calendar navigation
    previousMonth: '上个月',
    nextMonth: '下个月',
    // View navigation
    openPreviousView: '前一个视图',
    openNextView: '下一个视图',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year' ? '年视图已打开，切换为日历视图' : '日历视图已打开，切换为年视图';
    },
    // DateRange labels
    start: '开始',
    end: '结束',
    startDate: '开始日期',
    startTime: '开始时间',
    endDate: '结束日期',
    endTime: '结束时间',
    // Action bar
    cancelButtonLabel: '取消',
    clearButtonLabel: '清除',
    okButtonLabel: '确认',
    todayButtonLabel: '今天',
    nextStepButtonLabel: '下个',
    // Toolbar titles
    datePickerToolbarTitle: '选择日期',
    dateTimePickerToolbarTitle: '选择日期和时间',
    timePickerToolbarTitle: '选择时间',
    dateRangePickerToolbarTitle: '选择日期范围',
    timeRangePickerToolbarTitle: '选择时间范围',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u9009\u62E9 ".concat(views[view], ". ").concat(!formattedTime ? '未选择时间' : "\u5DF2\u9009\u62E9".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, "\u5C0F\u65F6"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, "\u5206\u949F"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, "\u79D2"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u9009\u62E9 ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: '周数',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u7B2C".concat(weekNumber, "\u5468"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u9009\u62E9\u65E5\u671F\uFF0C\u5DF2\u9009\u62E9".concat(formattedDate) : '选择日期';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u9009\u62E9\u65F6\u95F4\uFF0C\u5DF2\u9009\u62E9".concat(formattedTime) : '选择时间';
    },
    openRangePickerDialogue: function (formattedRange) {
        return formattedRange ? "\u9009\u62E9\u8303\u56F4\uFF0C\u5DF2\u9009\u8303\u56F4\u662F ".concat(formattedRange) : '选择范围';
    },
    fieldClearLabel: '清除',
    // Table labels
    timeTableLabel: '选择时间',
    dateTableLabel: '选择日期',
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
    hours: '时',
    minutes: '分',
    seconds: '秒',
    meridiem: '十二小时制',
    // Common
    empty: '空',
};
exports.zhCN = (0, getPickersLocalization_1.getPickersLocalization)(zhCNPickers);
