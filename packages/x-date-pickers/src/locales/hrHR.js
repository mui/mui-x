"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrHR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'sati',
    minutes: 'minute',
    seconds: 'sekunde',
    meridiem: 'meridiem',
};
var hrHRPickers = {
    // Calendar navigation
    previousMonth: 'Prethodni mjesec',
    nextMonth: 'Naredni mjesec',
    // View navigation
    openPreviousView: 'Otvori prethodni prikaz',
    openNextView: 'Otvori naredni prikaz',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'Otvoren je godišnji prikaz, promijeni na kalendarski prikaz'
            : 'Otvoren je kalendarski prikaz, promijeni na godišnji prikaz';
    },
    // DateRange labels
    start: 'Početak',
    end: 'Kraj',
    startDate: 'Početni datum',
    startTime: 'Početno vrijeme',
    endDate: 'Krajnji datum',
    endTime: 'Krajnje vrijeme',
    // Action bar
    cancelButtonLabel: 'Otkaži',
    clearButtonLabel: 'Izbriši',
    okButtonLabel: 'U redu',
    todayButtonLabel: 'Danas',
    nextStepButtonLabel: 'Naredni',
    // Toolbar titles
    datePickerToolbarTitle: 'Odaberi datum',
    dateTimePickerToolbarTitle: 'Odaberi datum i vrijeme',
    timePickerToolbarTitle: 'Odaberi vrijeme',
    dateRangePickerToolbarTitle: 'Odaberi vremenski okvir',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "Odaberi ".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, ". ").concat(!formattedTime ? 'Vrijeme nije odabrano' : "Odabrano vrijeme je ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) {
        var suffix = 'sati';
        if (Number(hours) === 1) {
            suffix = 'sat';
        }
        else if (Number(hours) < 5) {
            suffix = 'sata';
        }
        return "".concat(hours, " ").concat(suffix);
    },
    minutesClockNumberText: function (minutes) {
        return "".concat(minutes, " ").concat(Number(minutes) > 1 && Number(minutes) < 5 ? 'minute' : 'minuta');
    },
    secondsClockNumberText: function (seconds) {
        var suffix = 'sekundi';
        if (Number(seconds) === 1) {
            suffix = 'sekunda';
        }
        else if (Number(seconds) < 5) {
            suffix = 'sekunde';
        }
        return "".concat(seconds, " ").concat(suffix);
    },
    // Digital clock labels
    selectViewText: function (view) { return "Odaberi ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Broj tjedna',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Tjedan ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Odaberi datum, odabrani datum je ".concat(formattedDate) : 'Odaberi datum';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Odaberi vrijeme, odabrano vrijeme je ".concat(formattedTime) : 'Odaberi vrijeme';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Izbriši',
    // Table labels
    timeTableLabel: 'Odaberi vrijeme',
    dateTableLabel: 'Odaberi datum',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'G'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Godina',
    month: 'Mjesec',
    day: 'Dan',
    weekDay: 'Dan u tjednu',
    hours: 'Sati',
    minutes: 'Minute',
    seconds: 'Sekunde',
    meridiem: 'Meridiem',
    // Common
    empty: 'Isprazni',
};
exports.hrHR = (0, getPickersLocalization_1.getPickersLocalization)(hrHRPickers);
