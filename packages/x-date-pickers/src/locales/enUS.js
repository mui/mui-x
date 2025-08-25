"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enUS = exports.DEFAULT_LOCALE = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// This object is not Partial<PickersLocaleText> because it is the default values
var enUSPickers = {
    // Calendar navigation
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    // View navigation
    openPreviousView: 'Open previous view',
    openNextView: 'Open next view',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'year view is open, switch to calendar view'
            : 'calendar view is open, switch to year view';
    },
    // DateRange labels
    start: 'Start',
    end: 'End',
    startDate: 'Start date',
    startTime: 'Start time',
    endDate: 'End date',
    endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Cancel',
    clearButtonLabel: 'Clear',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Today',
    nextStepButtonLabel: 'Next',
    // Toolbar titles
    datePickerToolbarTitle: 'Select date',
    dateTimePickerToolbarTitle: 'Select date & time',
    timePickerToolbarTitle: 'Select time',
    dateRangePickerToolbarTitle: 'Select date range',
    timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Select ".concat(view, ". ").concat(!formattedTime ? 'No time selected' : "Selected time is ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " hours"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutes"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " seconds"); },
    // Digital clock labels
    selectViewText: function (view) { return "Select ".concat(view); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Week number',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Week ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Choose date, selected date is ".concat(formattedDate) : 'Choose date';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Choose time, selected time is ".concat(formattedTime) : 'Choose time';
    },
    openRangePickerDialogue: function (formattedRange) {
        return formattedRange ? "Choose range, selected range is ".concat(formattedRange) : 'Choose range';
    },
    fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'pick time',
    dateTableLabel: 'pick date',
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
    year: 'Year',
    month: 'Month',
    day: 'Day',
    weekDay: 'Week day',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    meridiem: 'Meridiem',
    // Common
    empty: 'Empty',
};
exports.DEFAULT_LOCALE = enUSPickers;
exports.enUS = (0, getPickersLocalization_1.getPickersLocalization)(enUSPickers);
