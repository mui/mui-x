"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nlNL = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'uren',
    minutes: 'minuten',
    seconds: 'seconden',
    meridiem: 'meridium',
};
var nlNLPickers = {
    // Calendar navigation
    previousMonth: 'Vorige maand',
    nextMonth: 'Volgende maand',
    // View navigation
    openPreviousView: 'Open vorige view',
    openNextView: 'Open volgende view',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'jaarweergave is geopend, schakel over naar kalenderweergave'
            : 'kalenderweergave is geopend, switch naar jaarweergave';
    },
    // DateRange labels
    start: 'Start',
    end: 'Einde',
    startDate: 'Startdatum',
    startTime: 'Starttijd',
    endDate: 'Einddatum',
    endTime: 'Eindtijd',
    // Action bar
    cancelButtonLabel: 'Annuleren',
    clearButtonLabel: 'Resetten',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Vandaag',
    nextStepButtonLabel: 'Volgende',
    // Toolbar titles
    datePickerToolbarTitle: 'Selecteer datum',
    dateTimePickerToolbarTitle: 'Selecteer datum & tijd',
    timePickerToolbarTitle: 'Selecteer tijd',
    dateRangePickerToolbarTitle: 'Selecteer datumbereik',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Selecteer ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Geen tijd geselecteerd' : "Geselecteerde tijd is ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " uren"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minuten"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " seconden"); },
    // Digital clock labels
    selectViewText: function (view) { return "Selecteer ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Weeknummer',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Week ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Kies datum, geselecteerde datum is ".concat(formattedDate) : 'Kies datum';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Kies tijd, geselecteerde tijd is ".concat(formattedTime) : 'Kies tijd';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Wissen',
    // Table labels
    timeTableLabel: 'kies tijd',
    dateTableLabel: 'kies datum',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'J'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'uu'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Jaar',
    month: 'Maand',
    day: 'Dag',
    weekDay: 'Weekdag',
    hours: 'Uren',
    minutes: 'Minuten',
    seconds: 'Seconden',
    meridiem: 'Middag',
    // Common
    empty: 'Leeg',
};
exports.nlNL = (0, getPickersLocalization_1.getPickersLocalization)(nlNLPickers);
