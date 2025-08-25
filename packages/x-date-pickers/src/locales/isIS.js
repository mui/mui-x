"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIS = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'klukkustundir',
    minutes: 'mínútur',
    seconds: 'sekúndur',
    meridiem: 'eftirmiðdagur',
};
var isISPickers = {
    // Calendar navigation
    previousMonth: 'Fyrri mánuður',
    nextMonth: 'Næsti mánuður',
    // View navigation
    openPreviousView: 'Opna fyrri skoðun',
    openNextView: 'Opna næstu skoðun',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'ársskoðun er opin, skipta yfir í dagatalsskoðun'
            : 'dagatalsskoðun er opin, skipta yfir í ársskoðun';
    },
    // DateRange labels
    start: 'Upphaf',
    end: 'Endir',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Hætta við',
    clearButtonLabel: 'Hreinsa',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Í dag',
    nextStepButtonLabel: 'Næsti',
    // Toolbar titles
    datePickerToolbarTitle: 'Velja dagsetningu',
    dateTimePickerToolbarTitle: 'Velja dagsetningu og tíma',
    timePickerToolbarTitle: 'Velja tíma',
    dateRangePickerToolbarTitle: 'Velja tímabil',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Velja ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Enginn tími valinn' : "Valinn t\u00EDmi er ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " klukkustundir"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " m\u00EDn\u00FAtur"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sek\u00FAndur"); },
    // Digital clock labels
    selectViewText: function (view) { return "Velja ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Vikunúmer',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Vika ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Velja dagsetningu, valin dagsetning er ".concat(formattedDate) : 'Velja dagsetningu';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Velja t\u00EDma, valinn t\u00EDmi er ".concat(formattedTime) : 'Velja tíma';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'velja tíma',
    dateTableLabel: 'velja dagsetningu',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Á'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'kk'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'ee'; },
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
exports.isIS = (0, getPickersLocalization_1.getPickersLocalization)(isISPickers);
