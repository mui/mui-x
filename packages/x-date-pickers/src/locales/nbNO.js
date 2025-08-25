"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nbNO = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'timer',
    minutes: 'minutter',
    seconds: 'sekunder',
    meridiem: 'meridiem',
};
var nbNOPickers = {
    // Calendar navigation
    previousMonth: 'Forrige måned',
    nextMonth: 'Neste måned',
    // View navigation
    openPreviousView: 'Åpne forrige visning',
    openNextView: 'Åpne neste visning',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'årsvisning er åpen, bytt til kalendervisning'
            : 'kalendervisning er åpen, bytt til årsvisning';
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
    datePickerToolbarTitle: 'Velg dato',
    dateTimePickerToolbarTitle: 'Velg dato & klokkeslett',
    timePickerToolbarTitle: 'Velg klokkeslett',
    dateRangePickerToolbarTitle: 'Velg datoperiode',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Velg ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Ingen tid valgt' : "Valgt tid er ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " timer"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutter"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekunder"); },
    // Digital clock labels
    selectViewText: function (view) { return "Velg ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Ukenummer',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Uke ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Velg dato, valgt dato er ".concat(formattedDate) : 'Velg dato';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Velg tid, valgt tid er ".concat(formattedTime) : 'Velg tid';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Slett',
    // Table labels
    timeTableLabel: 'velg tid',
    dateTableLabel: 'velg dato',
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
    month: 'Måned',
    day: 'Dag',
    weekDay: 'Ukedag',
    hours: 'Timer',
    minutes: 'Minutter',
    seconds: 'Sekunder',
    meridiem: 'Meridiem',
    // Common
    empty: 'Tøm',
};
exports.nbNO = (0, getPickersLocalization_1.getPickersLocalization)(nbNOPickers);
