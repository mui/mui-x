"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skSK = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'Hodiny',
    minutes: 'Minúty',
    seconds: 'Sekundy',
    meridiem: 'Popoludnie',
};
var skSKPickers = {
    // Calendar navigation
    previousMonth: 'Predchádzajúci mesiac',
    nextMonth: 'Ďalší mesiac',
    // View navigation
    openPreviousView: 'Otvoriť predchádzajúce zobrazenie',
    openNextView: 'Otvoriť ďalšie zobrazenie',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'ročné zobrazenie otvorené, prepnite do zobrazenia kalendára'
            : 'zobrazenie kalendára otvorené, prepnite do zobrazenia roka';
    },
    // DateRange labels
    start: 'Začiatok',
    end: 'Koniec',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Zrušiť',
    clearButtonLabel: 'Vymazať',
    okButtonLabel: 'Potvrdiť',
    todayButtonLabel: 'Dnes',
    nextStepButtonLabel: 'Ďalší',
    // Toolbar titles
    datePickerToolbarTitle: 'Vyberte dátum',
    dateTimePickerToolbarTitle: 'Vyberte dátum a čas',
    timePickerToolbarTitle: 'Vyberte čas',
    dateRangePickerToolbarTitle: 'Vyberete rozmedzie dátumov',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, " vybran\u00FD. ").concat(!formattedTime ? 'Nie je vybraný čas' : "Vybran\u00FD \u010Das je ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " hod\u00EDn"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " min\u00FAt"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sek\u00FAnd"); },
    // Digital clock labels
    selectViewText: function (view) { return "Vyberte ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Týždeň v roku',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "".concat(weekNumber, " t\u00FD\u017Ede\u0148 v roku"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Vyberte d\u00E1tum, vybran\u00FD d\u00E1tum je ".concat(formattedDate) : 'Vyberte dátum';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Vyberte \u010Das, vybran\u00FD \u010Das je ".concat(formattedTime) : 'Vyberte čas';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'vyberte čas',
    dateTableLabel: 'vyberte dátum',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Y'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
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
exports.skSK = (0, getPickersLocalization_1.getPickersLocalization)(skSKPickers);
