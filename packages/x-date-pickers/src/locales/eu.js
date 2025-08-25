"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eu = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'orduak',
    minutes: 'minutuak',
    seconds: 'segunduak',
    meridiem: 'meridianoa',
};
var euPickers = {
    // Calendar navigation
    previousMonth: 'Azken hilabetea',
    nextMonth: 'Hurrengo hilabetea',
    // View navigation
    openPreviousView: 'azken bista ireki',
    openNextView: 'hurrengo bista ireki',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'urteko bista irekita dago, aldatu egutegi bistara'
            : 'egutegi bista irekita dago, aldatu urteko bistara';
    },
    // DateRange labels
    start: 'Hasi',
    end: 'Bukatu',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Utxi',
    clearButtonLabel: 'Garbitu',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Gaur',
    nextStepButtonLabel: 'Hurrengo',
    // Toolbar titles
    datePickerToolbarTitle: 'Data aukeratu',
    dateTimePickerToolbarTitle: 'Data eta ordua aukeratu',
    timePickerToolbarTitle: 'Ordua aukeratu',
    dateRangePickerToolbarTitle: 'Data tartea aukeratu',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Aukeratu ".concat(views[view], ". ").concat(!formattedTime ? 'Ez da ordurik aukertau' : "Aukeratutako ordua ".concat(formattedTime, " da"));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " ordu"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutu"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " segundu"); },
    // Digital clock labels
    selectViewText: function (view) { return "Aukeratu ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Astea zenbakia',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "".concat(weekNumber, " astea"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Data aukeratu, aukeratutako data ".concat(formattedDate, " da") : 'Data aukeratu';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Ordua aukeratu, aukeratutako ordua ".concat(formattedTime, " da") : 'Ordua aukeratu';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Balioa garbitu',
    // Table labels
    timeTableLabel: 'ordua aukeratu',
    dateTableLabel: 'data aukeratu',
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
exports.eu = (0, getPickersLocalization_1.getPickersLocalization)(euPickers);
