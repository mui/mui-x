"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mk = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// This object is not Partial<PickersLocaleText> because it is the default values
var mkPickers = {
    // Calendar navigation
    previousMonth: 'Предходен месец',
    nextMonth: 'Следен месец',
    // View navigation
    openPreviousView: 'отвори претходен приказ',
    openNextView: 'отвори следен приказ',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'годишен приказ, отвори календарски приказ'
            : 'календарски приказ, отвори годишен приказ';
    },
    // DateRange labels
    start: 'Почеток',
    end: 'Крај',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Откажи',
    clearButtonLabel: 'Избриши',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Денес',
    nextStepButtonLabel: 'Следен',
    // Toolbar titles
    datePickerToolbarTitle: 'Избери датум',
    dateTimePickerToolbarTitle: 'Избери датум и време',
    timePickerToolbarTitle: 'Избери време',
    dateRangePickerToolbarTitle: 'Избери временски опсег',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Select ".concat(view, ". ").concat(!formattedTime ? 'Нема избрано време' : "\u0418\u0437\u0431\u0440\u0430\u043D\u043E\u0442\u043E \u0432\u0440\u0435\u043C\u0435 \u0435 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0447\u0430\u0441\u0430"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u043C\u0438\u043D\u0443\u0442\u0438"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434\u0438"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u0418\u0437\u0431\u0435\u0440\u0438 ".concat(view); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Недела број',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u041D\u0435\u0434\u0435\u043B\u0430 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u0418\u0437\u0431\u0435\u0440\u0438 \u0434\u0430\u0442\u0443\u043C, \u0438\u0437\u0431\u0440\u0430\u043D\u0438\u043E\u0442 \u0434\u0430\u0442\u0443\u043C \u0435 ".concat(formattedDate) : 'Избери датум';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0418\u0437\u0431\u0435\u0440\u0438 \u0432\u0440\u0435\u043C\u0435, \u0438\u0437\u0431\u0440\u0430\u043D\u043E\u0442\u043E \u0432\u0440\u0435\u043C\u0435 \u0435 ".concat(formattedTime) : 'Избери време';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Избриши',
    // Table labels
    timeTableLabel: 'одбери време',
    dateTableLabel: 'одбери датум',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Г'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'ДД'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'чч'; },
    fieldMinutesPlaceholder: function () { return 'мм'; },
    fieldSecondsPlaceholder: function () { return 'сс'; },
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
exports.mk = (0, getPickersLocalization_1.getPickersLocalization)(mkPickers);
