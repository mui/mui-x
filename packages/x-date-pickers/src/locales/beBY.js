"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beBY = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    // maps TimeView to its translation
    hours: 'гадзіны',
    minutes: 'хвіліны',
    seconds: 'секунды',
    meridiem: 'мерыдыем',
};
var beBYPickers = {
    // Calendar navigation
    previousMonth: 'Папярэдні месяц',
    nextMonth: 'Наступны месяц',
    // View navigation
    openPreviousView: 'Aдкрыць папярэдні выгляд',
    openNextView: 'Aдкрыць наступны выгляд',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'гадавы выгляд адкрыты, перайсці да каляндарнага выгляду'
            : 'каляндарны выгляд адкрыты, перайсці да гадавога выгляду';
    },
    // DateRange labels
    start: 'Пачатак',
    end: 'Канец',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Адмена',
    clearButtonLabel: 'Ачысціць',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Сёння',
    nextStepButtonLabel: 'Наступны',
    // Toolbar titles
    datePickerToolbarTitle: 'Абраць дату',
    dateTimePickerToolbarTitle: 'Абраць дату і час',
    timePickerToolbarTitle: 'Абраць час',
    dateRangePickerToolbarTitle: 'Абраць каляндарны перыяд',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u0410\u0431\u044F\u0440\u044B\u0446\u0435 ".concat(views[view], ". ").concat(!formattedTime ? 'Час не абраны' : "\u0410\u0431\u0440\u0430\u043D\u044B \u0447\u0430\u0441 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0433\u0430\u0434\u0437\u0456\u043D"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u0445\u0432\u0456\u043B\u0456\u043D"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u0410\u0431\u044F\u0440\u044B\u0446\u0435 ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Нумар тыдня',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u0422\u044B\u0434\u0437\u0435\u043D\u044C ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u0410\u0431\u0440\u0430\u0446\u044C \u0434\u0430\u0442\u0443, \u0430\u0431\u0440\u0430\u043D\u0430 \u0434\u0430\u0442\u0430  ".concat(formattedDate) : 'Абраць дату';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0410\u0431\u0440\u0430\u0446\u044C \u0447\u0430\u0441, \u0430\u0431\u0440\u044B\u043D\u044B \u0447\u0430\u0441  ".concat(formattedTime) : 'Абраць час';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'абраць час',
    dateTableLabel: 'абраць дату',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Y'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    // year: 'Year',
    // month: 'Month',
    // day: 'Day',
    // weekDay: 'Week day',
    // hours: 'Hours',
    // minutes: 'Minutes',
    // seconds: 'Seconds',
    // meridiem: 'Meridiem',
    // Common
    // empty: 'Empty',
};
exports.beBY = (0, getPickersLocalization_1.getPickersLocalization)(beBYPickers);
