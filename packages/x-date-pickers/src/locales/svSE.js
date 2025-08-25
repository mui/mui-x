"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svSE = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'timmar',
    minutes: 'minuter',
    seconds: 'sekunder',
    meridiem: 'meridiem',
};
var svSEPickers = {
    // Calendar navigation
    previousMonth: 'Föregående månad',
    nextMonth: 'Nästa månad',
    // View navigation
    openPreviousView: 'Öppna föregående vy',
    openNextView: 'Öppna nästa vy',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'årsvyn är öppen, byt till kalendervy'
            : 'kalendervyn är öppen, byt till årsvy';
    },
    // DateRange labels
    start: 'Start',
    end: 'Slut',
    startDate: 'Startdatum',
    startTime: 'Starttid',
    endDate: 'Slutdatum',
    endTime: 'Sluttid',
    // Action bar
    cancelButtonLabel: 'Avbryt',
    clearButtonLabel: 'Rensa',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Idag',
    nextStepButtonLabel: 'Nästa',
    // Toolbar titles
    datePickerToolbarTitle: 'Välj datum',
    dateTimePickerToolbarTitle: 'Välj datum & tid',
    timePickerToolbarTitle: 'Välj tid',
    dateRangePickerToolbarTitle: 'Välj datumintervall',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "V\u00E4lj ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Ingen tid vald' : "Vald tid \u00E4r ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " timmar"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minuter"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekunder"); },
    // Digital clock labels
    selectViewText: function (view) { return "V\u00E4lj ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Vecka nummer',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Vecka ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "V\u00E4lj datum, valt datum \u00E4r ".concat(formattedDate) : 'Välj datum';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "V\u00E4lj tid, vald tid \u00E4r ".concat(formattedTime) : 'Välj tid';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Rensa värde',
    // Table labels
    timeTableLabel: 'välj tid',
    dateTableLabel: 'välj datum',
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
    weekDay: 'Veckodag',
    hours: 'Timmar',
    minutes: 'Minuter',
    seconds: 'Sekunder',
    meridiem: 'Meridiem',
    // Common
    empty: 'Tom',
};
exports.svSE = (0, getPickersLocalization_1.getPickersLocalization)(svSEPickers);
