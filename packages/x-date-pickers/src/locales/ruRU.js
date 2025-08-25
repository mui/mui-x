"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruRU = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// Translation map for Clock Label
var timeViews = {
    hours: 'часы',
    minutes: 'минуты',
    seconds: 'секунды',
    meridiem: 'меридием',
};
var ruRUPickers = {
    // Calendar navigation
    previousMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    // View navigation
    openPreviousView: 'Открыть предыдущий вид',
    openNextView: 'Открыть следующий вид',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'открыт годовой вид, переключить на календарный вид'
            : 'открыт календарный вид, переключить на годовой вид';
    },
    // DateRange labels
    start: 'Начало',
    end: 'Конец',
    startDate: 'Начальная дата',
    startTime: 'Начальное время',
    endDate: 'Конечная дата',
    endTime: 'Конечное время',
    // Action bar
    cancelButtonLabel: 'Отмена',
    clearButtonLabel: 'Очистить',
    okButtonLabel: 'Ок',
    todayButtonLabel: 'Сегодня',
    nextStepButtonLabel: 'Следующий',
    // Toolbar titles
    datePickerToolbarTitle: 'Выбрать дату',
    dateTimePickerToolbarTitle: 'Выбрать дату и время',
    timePickerToolbarTitle: 'Выбрать время',
    dateRangePickerToolbarTitle: 'Выбрать период',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u0412\u044B\u0431\u0440\u0430\u0442\u044C ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Время не выбрано' : "\u0412\u044B\u0431\u0440\u0430\u043D\u043E \u0432\u0440\u0435\u043C\u044F ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0447\u0430\u0441\u043E\u0432"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u043C\u0438\u043D\u0443\u0442"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u0412\u044B\u0431\u0440\u0430\u0442\u044C ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Номер недели',
    calendarWeekNumberHeaderText: '№',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u041D\u0435\u0434\u0435\u043B\u044F ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0443, \u0432\u044B\u0431\u0440\u0430\u043D\u0430 \u0434\u0430\u0442\u0430 ".concat(formattedDate) : 'Выберите дату';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F, \u0432\u044B\u0431\u0440\u0430\u043D\u043E \u0432\u0440\u0435\u043C\u044F ".concat(formattedTime) : 'Выберите время';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Очистить значение',
    // Table labels
    timeTableLabel: 'выбрать время',
    dateTableLabel: 'выбрать дату',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Г'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'ММММ' : 'ММ'); },
    fieldDayPlaceholder: function () { return 'ДД'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'ДДДД' : 'ДД'); },
    fieldHoursPlaceholder: function () { return 'чч'; },
    fieldMinutesPlaceholder: function () { return 'мм'; },
    fieldSecondsPlaceholder: function () { return 'сс'; },
    fieldMeridiemPlaceholder: function () { return '(д|п)п'; },
    // View names
    year: 'Год',
    month: 'Месяц',
    day: 'День',
    weekDay: 'День недели',
    hours: 'Часы',
    minutes: 'Минуты',
    seconds: 'Секунды',
    meridiem: 'Меридием',
    // Common
    empty: 'Пустой',
};
exports.ruRU = (0, getPickersLocalization_1.getPickersLocalization)(ruRUPickers);
