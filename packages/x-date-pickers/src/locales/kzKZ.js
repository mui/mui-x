"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kzKZ = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// Translation map for Clock Label
var timeViews = {
    hours: 'Сағатты',
    minutes: 'Минутты',
    seconds: 'Секундты',
    meridiem: 'Меридием',
};
var kzKZPickers = {
    // Calendar navigation
    previousMonth: 'Алдыңғы ай',
    nextMonth: 'Келесі ай',
    // View navigation
    openPreviousView: 'Алдыңғы көріністі ашу',
    openNextView: 'Келесі көріністі ашу',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'жылдық көріністі ашу, күнтізбе көрінісіне ауысу'
            : 'күнтізбе көрінісін ашу, жылдық көрінісіне ауысу';
    },
    // DateRange labels
    start: 'Бастау',
    end: 'Cоңы',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Бас тарту',
    clearButtonLabel: 'Тазарту',
    okButtonLabel: 'Ок',
    todayButtonLabel: 'Бүгін',
    nextStepButtonLabel: 'Келесі',
    // Toolbar titles
    datePickerToolbarTitle: 'Күнді таңдау',
    dateTimePickerToolbarTitle: 'Күн мен уақытты таңдау',
    timePickerToolbarTitle: 'Уақытты таңдау',
    dateRangePickerToolbarTitle: 'Кезеңді таңдаңыз',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "".concat(timeViews[view], " \u0442\u0430\u04A3\u0434\u0430\u0443. ").concat(!formattedTime ? 'Уақыт таңдалмаған' : "\u0422\u0430\u04A3\u0434\u0430\u043B\u0493\u0430\u043D \u0443\u0430\u049B\u044B\u0442 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0441\u0430\u0493\u0430\u0442"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u043C\u0438\u043D\u0443\u0442"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0441\u0435\u043A\u0443\u043D\u0434"); },
    // Digital clock labels
    selectViewText: function (view) { return "".concat(timeViews[view], " \u0442\u0430\u04A3\u0434\u0430\u0443"); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Апта нөмірі',
    calendarWeekNumberHeaderText: '№',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u0410\u043F\u0442\u0430 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u041A\u04AF\u043D\u0434\u0456 \u0442\u0430\u04A3\u0434\u0430\u04A3\u044B\u0437, \u0442\u0430\u04A3\u0434\u0430\u043B\u0493\u0430\u043D \u043A\u04AF\u043D ".concat(formattedDate) : 'Күнді таңдаңыз';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0423\u0430\u049B\u044B\u0442\u0442\u044B \u0442\u0430\u04A3\u0434\u0430\u04A3\u044B\u0437, \u0442\u0430\u04A3\u0434\u0430\u043B\u0493\u0430\u043D \u0443\u0430\u049B\u044B\u0442 ".concat(formattedTime) : 'Уақытты таңдаңыз';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'уақытты таңдау',
    dateTableLabel: 'күнді таңдау',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Ж'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'AAAA' : 'AA'); },
    fieldDayPlaceholder: function () { return 'КК'; },
    // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
    fieldHoursPlaceholder: function () { return 'сс'; },
    fieldMinutesPlaceholder: function () { return 'мм'; },
    fieldSecondsPlaceholder: function () { return 'сс'; },
    fieldMeridiemPlaceholder: function () { return '(т|к)'; },
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
exports.kzKZ = (0, getPickersLocalization_1.getPickersLocalization)(kzKZPickers);
