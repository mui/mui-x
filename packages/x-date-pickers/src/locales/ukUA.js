"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ukUA = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'годин',
    minutes: 'хвилин',
    seconds: 'секунд',
    meridiem: 'Південь',
};
var ukUAPickers = {
    // Calendar navigation
    previousMonth: 'Попередній місяць',
    nextMonth: 'Наступний місяць',
    // View navigation
    openPreviousView: 'Відкрити попередній вигляд',
    openNextView: 'Відкрити наступний вигляд',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'річний вигляд відкрито, перейти до календарного вигляду'
            : 'календарний вигляд відкрито, перейти до річного вигляду';
    },
    // DateRange labels
    start: 'Початок',
    end: 'Кінець',
    startDate: 'День початку',
    startTime: 'Час початку',
    endDate: 'День закінчення',
    endTime: 'Час закінчення',
    // Action bar
    cancelButtonLabel: 'Відміна',
    clearButtonLabel: 'Очистити',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Сьогодні',
    nextStepButtonLabel: 'Наступний',
    // Toolbar titles
    datePickerToolbarTitle: 'Вибрати дату',
    dateTimePickerToolbarTitle: 'Вибрати дату і час',
    timePickerToolbarTitle: 'Вибрати час',
    dateRangePickerToolbarTitle: 'Вибрати календарний період',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Час не вибраний' : "\u0412\u0438\u0431\u0440\u0430\u043D\u043E \u0447\u0430\u0441 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0433\u043E\u0434\u0438\u043D"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u0445\u0432\u0438\u043B\u0438\u043D"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Номер тижня',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u0422\u0438\u0436\u0434\u0435\u043D\u044C ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u0434\u0430\u0442\u0443, \u043E\u0431\u0440\u0430\u043D\u0430 \u0434\u0430\u0442\u0430  ".concat(formattedDate) : 'Оберіть дату';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u0447\u0430\u0441, \u043E\u0431\u0440\u0430\u043D\u0438\u0439 \u0447\u0430\u0441  ".concat(formattedTime) : 'Оберіть час';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Очистити дані',
    // Table labels
    timeTableLabel: 'оберіть час',
    dateTableLabel: 'оберіть дату',
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
    year: 'Рік',
    month: 'Місяць',
    day: 'День',
    weekDay: 'День тижня',
    hours: 'Годин',
    minutes: 'Хвилин',
    seconds: 'Секунд',
    meridiem: 'Меридіем',
    // Common
    empty: 'Порожній',
};
exports.ukUA = (0, getPickersLocalization_1.getPickersLocalization)(ukUAPickers);
