"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itIT = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'le ore',
    minutes: 'i minuti',
    seconds: 'i secondi',
    meridiem: 'il meridiano',
};
var itITPickers = {
    // Calendar navigation
    previousMonth: 'Mese precedente',
    nextMonth: 'Mese successivo',
    // View navigation
    openPreviousView: 'Apri la vista precedente',
    openNextView: 'Apri la vista successiva',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? "la vista dell'anno è aperta, passare alla vista del calendario"
            : "la vista dell'calendario è aperta, passare alla vista dell'anno";
    },
    // DateRange labels
    start: 'Inizio',
    end: 'Fine',
    startDate: 'Data di inizio',
    startTime: 'Ora di inizio',
    endDate: 'Data di fine',
    endTime: 'Ora di fine',
    // Action bar
    cancelButtonLabel: 'Annulla',
    clearButtonLabel: 'Pulisci',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Oggi',
    nextStepButtonLabel: 'Successivo',
    // Toolbar titles
    datePickerToolbarTitle: 'Seleziona data',
    dateTimePickerToolbarTitle: 'Seleziona data e orario',
    timePickerToolbarTitle: 'Seleziona orario',
    dateRangePickerToolbarTitle: 'Seleziona intervallo di date',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Seleziona ".concat(views[view], ". ").concat(!formattedTime ? 'Nessun orario selezionato' : "L'ora selezionata \u00E8 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " ore"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minuti"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " secondi"); },
    // Digital clock labels
    selectViewText: function (view) { return "Seleziona ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Numero settimana',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Settimana ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Scegli la data, la data selezionata \u00E8 ".concat(formattedDate) : 'Scegli la data';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Scegli l'ora, l'ora selezionata \u00E8 ".concat(formattedTime) : "Scegli l'ora";
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Cancella valore',
    // Table labels
    timeTableLabel: "scegli un'ora",
    dateTableLabel: 'scegli una data',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'A'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'GG'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'GGGG' : 'GG'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Anno',
    month: 'Mese',
    day: 'Giorno',
    weekDay: 'Giorno della settimana',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi',
    meridiem: 'Meridiano',
    // Common
    empty: 'Vuoto',
};
exports.itIT = (0, getPickersLocalization_1.getPickersLocalization)(itITPickers);
