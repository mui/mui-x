"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nnNO = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'timar',
    minutes: 'minuttar',
    seconds: 'sekundar',
    meridiem: 'meridiem',
};
var nnNOPickers = {
    // Calendar navigation
    previousMonth: 'Forrige månad',
    nextMonth: 'Neste månad',
    // View navigation
    openPreviousView: 'Opne forrige visning',
    openNextView: 'Opne neste visning',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'årsvisning er open, byt til kalendervisning'
            : 'kalendervisning er open, byt til årsvisning';
    },
    // DateRange labels
    start: 'Start',
    end: 'Slutt',
    startDate: 'Startdato',
    startTime: 'Starttid',
    endDate: 'Sluttdato',
    endTime: 'Slutttid',
    // Action bar
    cancelButtonLabel: 'Avbryt',
    clearButtonLabel: 'Fjern',
    okButtonLabel: 'OK',
    todayButtonLabel: 'I dag',
    nextStepButtonLabel: 'Neste',
    // Toolbar titles
    datePickerToolbarTitle: 'Vel dato',
    dateTimePickerToolbarTitle: 'Vel dato & klokkeslett',
    timePickerToolbarTitle: 'Vel klokkeslett',
    dateRangePickerToolbarTitle: 'Vel datoperiode',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Vel ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Ingen tid vald' : "Vald tid er ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " timar"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minuttar"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekundar"); },
    // Digital clock labels
    selectViewText: function (view) { return "Vel ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Vekenummer',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Veke ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Vel dato, vald dato er ".concat(formattedDate) : 'Vel dato';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Vel tid, vald tid er ".concat(formattedTime) : 'Vel tid';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Fjern verdi',
    // Table labels
    timeTableLabel: 'vel tid',
    dateTableLabel: 'vel dato',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Å'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'tt'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'År',
    month: 'Månad',
    day: 'Dag',
    weekDay: 'Vekedag',
    hours: 'Timar',
    minutes: 'Minuttar',
    seconds: 'Sekundar',
    meridiem: 'Meridiem',
    // Common
    empty: 'Tom',
};
exports.nnNO = (0, getPickersLocalization_1.getPickersLocalization)(nnNOPickers);
