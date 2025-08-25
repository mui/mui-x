"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daDK = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'Timer',
    minutes: 'Minutter',
    seconds: 'Sekunder',
    meridiem: 'Meridiem',
};
var daDKPickers = {
    // Calendar navigation
    previousMonth: 'Forrige måned',
    nextMonth: 'Næste måned',
    // View navigation
    openPreviousView: 'Åben forrige visning',
    openNextView: 'Åben næste visning',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'årsvisning er åben, skift til kalendervisning'
            : 'kalendervisning er åben, skift til årsvisning';
    },
    // DateRange labels
    start: 'Start',
    end: 'Slut',
    startDate: 'Start dato',
    startTime: 'Start tid',
    endDate: 'Slut date',
    endTime: 'Slut tid',
    // Action bar
    cancelButtonLabel: 'Annuller',
    clearButtonLabel: 'Ryd',
    okButtonLabel: 'OK',
    todayButtonLabel: 'I dag',
    nextStepButtonLabel: 'Næste',
    // Toolbar titles
    datePickerToolbarTitle: 'Vælg dato',
    dateTimePickerToolbarTitle: 'Vælg dato & tidspunkt',
    timePickerToolbarTitle: 'Vælg tidspunkt',
    dateRangePickerToolbarTitle: 'Vælg datointerval',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "V\u00E6lg ".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, ". ").concat(!formattedTime ? 'Intet tidspunkt valgt' : "Valgte tidspunkt er ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " timer"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutter"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekunder"); },
    // Digital clock labels
    selectViewText: function (view) { return "V\u00E6lg ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Ugenummer',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Uge ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "V\u00E6lg dato, valgte dato er ".concat(formattedDate) : 'Vælg dato';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "V\u00E6lg tidspunkt, valgte tidspunkt er ".concat(formattedTime) : 'Vælg tidspunkt';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'ryd felt',
    // Table labels
    timeTableLabel: 'vælg tidspunkt',
    dateTableLabel: 'vælg dato',
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
    year: 'år',
    month: 'måned',
    day: 'dag',
    weekDay: 'ugedag',
    hours: 'timer',
    minutes: 'minutter',
    seconds: 'sekunder',
    meridiem: 'middag',
    // Common
    empty: 'tom',
};
exports.daDK = (0, getPickersLocalization_1.getPickersLocalization)(daDKPickers);
