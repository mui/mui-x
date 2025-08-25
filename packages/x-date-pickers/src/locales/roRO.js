"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roRO = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'Ore',
    minutes: 'Minute',
    seconds: 'Secunde',
    meridiem: 'Meridiane',
};
var roROPickers = {
    // Calendar navigation
    previousMonth: 'Luna anterioară',
    nextMonth: 'Luna următoare',
    // View navigation
    openPreviousView: 'Deschideți vizualizarea anterioară',
    openNextView: 'Deschideți vizualizarea următoare',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'Vizualizarea anuală este deschisă, comutați la vizualizarea calendarului'
            : 'Vizualizarea calendarului este deschisă, comutați la vizualizarea anuală';
    },
    // DateRange labels
    start: 'Început',
    end: 'Sfârșit',
    startDate: 'Data de început',
    startTime: 'Ora de început',
    endDate: 'Data de sfârșit',
    endTime: 'Ora de sfârșit',
    // Action bar
    cancelButtonLabel: 'Anulare',
    clearButtonLabel: 'Ștergere',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Astăzi',
    nextStepButtonLabel: 'Următoare',
    // Toolbar titles
    datePickerToolbarTitle: 'Selectați data',
    dateTimePickerToolbarTitle: 'Selectați data și ora',
    timePickerToolbarTitle: 'Selectați ora',
    dateRangePickerToolbarTitle: 'Selectați intervalul de date',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "Selecta\u021Bi ".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, ". ").concat(!formattedTime ? 'Nicio oră selectată' : "Ora selectat\u0103 este ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " ").concat(timeViews.hours); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " ").concat(timeViews.minutes); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, "  ").concat(timeViews.seconds); },
    // Digital clock labels
    selectViewText: function (view) { return "Selecta\u021Bi ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Număr săptămână',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "S\u0103pt\u0103m\u00E2na ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Selecta\u021Bi data, data selectat\u0103 este ".concat(formattedDate) : 'Selectați data';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Selecta\u021Bi ora, ora selectat\u0103 este ".concat(formattedTime) : 'Selectați ora';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Golire conținut',
    // Table labels
    timeTableLabel: 'Selectați ora',
    dateTableLabel: 'Selectați data',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'A'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'LLLL' : 'LL'); },
    fieldDayPlaceholder: function () { return 'ZZ'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'ZZZZ' : 'ZZ'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'An',
    month: 'Luna',
    day: 'Ziua',
    weekDay: 'Ziua saptămânii',
    hours: 'Ore',
    minutes: 'Minute',
    seconds: 'Secunde',
    meridiem: 'Meridiem',
    // Common
    empty: 'Gol',
};
exports.roRO = (0, getPickersLocalization_1.getPickersLocalization)(roROPickers);
