"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deDE = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    meridiem: 'Meridiem',
};
var deDEPickers = {
    // Calendar navigation
    previousMonth: 'Letzter Monat',
    nextMonth: 'Nächster Monat',
    // View navigation
    openPreviousView: 'Letzte Ansicht öffnen',
    openNextView: 'Nächste Ansicht öffnen',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'Jahresansicht ist geöffnet, zur Kalenderansicht wechseln'
            : 'Kalenderansicht ist geöffnet, zur Jahresansicht wechseln';
    },
    // DateRange labels
    start: 'Beginn',
    end: 'Ende',
    startDate: 'Startdatum',
    startTime: 'Startzeit',
    endDate: 'Enddatum',
    endTime: 'Endzeit',
    // Action bar
    cancelButtonLabel: 'Abbrechen',
    clearButtonLabel: 'Löschen',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Heute',
    nextStepButtonLabel: 'Nächster',
    // Toolbar titles
    datePickerToolbarTitle: 'Datum auswählen',
    dateTimePickerToolbarTitle: 'Datum & Uhrzeit auswählen',
    timePickerToolbarTitle: 'Uhrzeit auswählen',
    dateRangePickerToolbarTitle: 'Datumsbereich auswählen',
    timeRangePickerToolbarTitle: 'Zeitspanne auswählen',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, " ausw\u00E4hlen. ").concat(!formattedTime ? 'Keine Uhrzeit ausgewählt' : "Gew\u00E4hlte Uhrzeit ist ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " ").concat(timeViews.hours); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " ").concat(timeViews.minutes); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, "  ").concat(timeViews.seconds); },
    // Digital clock labels
    selectViewText: function (view) { return "".concat(timeViews[view], " ausw\u00E4hlen"); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Kalenderwoche',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Woche ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Datum ausw\u00E4hlen, gew\u00E4hltes Datum ist ".concat(formattedDate) : 'Datum auswählen';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime
            ? "Uhrzeit ausw\u00E4hlen, gew\u00E4hlte Uhrzeit ist ".concat(formattedTime)
            : 'Uhrzeit auswählen';
    },
    openRangePickerDialogue: function (formattedRange) {
        return formattedRange
            ? "Zeitspanne ausw\u00E4hlen, die aktuell ausgew\u00E4hlte Zeitspanne ist ".concat(formattedRange)
            : 'Zeitspanne auswählen';
    },
    fieldClearLabel: 'Wert leeren',
    // Table labels
    timeTableLabel: 'Uhrzeit auswählen',
    dateTableLabel: 'Datum auswählen',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'J'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'TT'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Jahr',
    month: 'Monat',
    day: 'Tag',
    weekDay: 'Wochentag',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    meridiem: 'Tageszeit',
    // Common
    empty: 'Leer',
};
exports.deDE = (0, getPickersLocalization_1.getPickersLocalization)(deDEPickers);
