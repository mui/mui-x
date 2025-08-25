"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bgBG = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'часове',
    minutes: 'минути',
    seconds: 'секунди',
    meridiem: 'преди обяд/след обяд',
};
var bgBGPickers = {
    // Calendar navigation
    previousMonth: 'Предишен месец',
    nextMonth: 'Следващ месец',
    // View navigation
    openPreviousView: 'Отвори предишен изглед',
    openNextView: 'Отвори следващ изглед',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'отворен е изглед на година, премини на изглед на календар'
            : 'отворен е изглед на календар, премини на изглед на година';
    },
    // DateRange labels
    start: 'Начало',
    end: 'Край',
    startDate: 'Начална дата',
    startTime: 'Начален час',
    endDate: 'Крайна дата',
    endTime: 'Краен час',
    // Action bar
    cancelButtonLabel: 'Отказ',
    clearButtonLabel: 'Изчисти',
    okButtonLabel: 'ОК',
    todayButtonLabel: 'Днес',
    nextStepButtonLabel: 'Следващ',
    // Toolbar titles
    datePickerToolbarTitle: 'Избери дата',
    dateTimePickerToolbarTitle: 'Избери дата и час',
    timePickerToolbarTitle: 'Избери час',
    dateRangePickerToolbarTitle: 'Избери времеви период',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u0418\u0437\u0431\u0435\u0440\u0438 ".concat(views[view], ". ").concat(!formattedTime ? 'Не е избран час' : "\u0418\u0437\u0431\u0440\u0430\u043D\u0438\u044F\u0442 \u0447\u0430\u0441 \u0435 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0447\u0430\u0441\u0430"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u043C\u0438\u043D\u0443\u0442\u0438"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434\u0438"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u0418\u0437\u0431\u0435\u0440\u0438 ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Седмица',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u0421\u0435\u0434\u043C\u0438\u0446\u0430 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u0418\u0437\u0431\u0435\u0440\u0438 \u0434\u0430\u0442\u0430, \u0438\u0437\u0431\u0440\u0430\u043D\u0430\u0442\u0430 \u0434\u0430\u0442\u0430 \u0435 ".concat(formattedDate) : 'Избери дата';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0418\u0437\u0431\u0435\u0440\u0438 \u0447\u0430\u0441, \u0438\u0437\u0431\u0440\u0430\u043D\u0438\u044F\u0442 \u0447\u0430\u0441 \u0435 ".concat(formattedTime) : 'Избери час';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Изчисти стойност',
    // Table labels
    timeTableLabel: 'избери час',
    dateTableLabel: 'избери дата',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Г'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'ММММ' : 'ММ'); },
    fieldDayPlaceholder: function () { return 'ДД'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'СССС' : 'СС'); },
    fieldHoursPlaceholder: function () { return 'чч'; },
    fieldMinutesPlaceholder: function () { return 'мм'; },
    fieldSecondsPlaceholder: function () { return 'сс'; },
    fieldMeridiemPlaceholder: function () { return 'пс'; },
    // View names
    year: 'Година',
    month: 'Месец',
    day: 'Ден',
    weekDay: 'Ден от седмицата',
    hours: 'Часове',
    minutes: 'Минути',
    seconds: 'Секунди',
    meridiem: 'Преди обяд/след обяд',
    // Common
    empty: 'Празно',
};
exports.bgBG = (0, getPickersLocalization_1.getPickersLocalization)(bgBGPickers);
