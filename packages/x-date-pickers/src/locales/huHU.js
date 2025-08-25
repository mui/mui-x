"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.huHU = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'Óra',
    minutes: 'Perc',
    seconds: 'Másodperc',
    meridiem: 'Délután',
};
var huHUPickers = {
    // Calendar navigation
    previousMonth: 'Előző hónap',
    nextMonth: 'Következő hónap',
    // View navigation
    openPreviousView: 'Előző nézet megnyitása',
    openNextView: 'Következő nézet megnyitása',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'az évválasztó már nyitva, váltson a naptárnézetre'
            : 'a naptárnézet már nyitva, váltson az évválasztóra';
    },
    // DateRange labels
    start: 'Kezdő dátum',
    end: 'Záró dátum',
    startDate: 'Kezdő dátum',
    startTime: 'Kezdő idő',
    endDate: 'Záró dátum',
    endTime: 'Záró idő',
    // Action bar
    cancelButtonLabel: 'Mégse',
    clearButtonLabel: 'Törlés',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Ma',
    nextStepButtonLabel: 'Következő',
    // Toolbar titles
    datePickerToolbarTitle: 'Dátum kiválasztása',
    dateTimePickerToolbarTitle: 'Dátum és idő kiválasztása',
    timePickerToolbarTitle: 'Idő kiválasztása',
    dateRangePickerToolbarTitle: 'Dátumhatárok kiválasztása',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, " kiv\u00E1laszt\u00E1sa. ").concat(!formattedTime ? 'Nincs kiválasztva idő' : "A kiv\u00E1lasztott id\u0151 ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " ").concat(timeViews.hours.toLowerCase()); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " ").concat(timeViews.minutes.toLowerCase()); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, "  ").concat(timeViews.seconds.toLowerCase()); },
    // Digital clock labels
    selectViewText: function (view) { return "".concat(timeViews[view], " kiv\u00E1laszt\u00E1sa"); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Hét',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "".concat(weekNumber, ". h\u00E9t"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "V\u00E1lasszon d\u00E1tumot, a kiv\u00E1lasztott d\u00E1tum: ".concat(formattedDate)
            : 'Válasszon dátumot';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "V\u00E1lasszon id\u0151t, a kiv\u00E1lasztott id\u0151: ".concat(formattedTime) : 'Válasszon időt';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Tartalom ürítése',
    // Table labels
    timeTableLabel: 'válasszon időt',
    dateTableLabel: 'válasszon dátumot',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'É'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'HHHH' : 'HH'); },
    fieldDayPlaceholder: function () { return 'NN'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'NNNN' : 'NN'); },
    fieldHoursPlaceholder: function () { return 'óó'; },
    fieldMinutesPlaceholder: function () { return 'pp'; },
    fieldSecondsPlaceholder: function () { return 'mm'; },
    fieldMeridiemPlaceholder: function () { return 'dd'; },
    // View names
    year: 'Év',
    month: 'Hónap',
    day: 'Nap',
    weekDay: 'Hétköznap',
    hours: timeViews.hours,
    minutes: timeViews.minutes,
    seconds: timeViews.seconds,
    meridiem: timeViews.meridiem,
    // Common
    empty: 'Üres',
};
exports.huHU = (0, getPickersLocalization_1.getPickersLocalization)(huHUPickers);
