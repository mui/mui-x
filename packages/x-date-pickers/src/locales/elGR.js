"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elGR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'ώρες',
    minutes: 'λεπτά',
    seconds: 'δευτερόλεπτα',
    meridiem: 'μεσημβρία',
};
var elGRPickers = {
    // Calendar navigation
    previousMonth: 'Προηγούμενος μήνας',
    nextMonth: 'Επόμενος μήνας',
    // View navigation
    openPreviousView: 'Άνοίγμα προηγούμενης προβολή',
    openNextView: 'Άνοίγμα επόμενης προβολή',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'η προβολή έτους είναι ανοιχτή, μεταβείτε στην προβολή ημερολογίου'
            : 'η προβολή ημερολογίου είναι ανοιχτή, μεταβείτε στην προβολή έτους';
    },
    // DateRange labels
    start: 'Αρχή',
    end: 'Τέλος',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'Άκυρο',
    clearButtonLabel: 'Καθαρισμός',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Σήμερα',
    nextStepButtonLabel: 'Επόμενος',
    // Toolbar titles
    datePickerToolbarTitle: 'Επιλέξτε ημερομηνία',
    dateTimePickerToolbarTitle: 'Επιλέξτε ημερομηνία και ώρα',
    timePickerToolbarTitle: 'Επιλέξτε ώρα',
    dateRangePickerToolbarTitle: 'Επιλέξτε εύρος ημερομηνιών',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u0395\u03C0\u03B9\u03BB\u03AD\u03BE\u03C4\u03B5 ".concat(views[view], ". ").concat(!formattedTime ? 'Δεν έχει επιλεγεί ώρα' : "\u0397 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7 \u03CE\u03C1\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u03CE\u03C1\u03B5\u03C2"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u03BB\u03B5\u03C0\u03C4\u03AC"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u03B4\u03B5\u03C5\u03C4\u03B5\u03C1\u03CC\u03BB\u03B5\u03C0\u03C4\u03B1"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u0395\u03C0\u03B9\u03BB\u03AD\u03BE\u03C4\u03B5 ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Αριθμός εβδομάδας',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u0395\u03B2\u03B4\u03BF\u03BC\u03AC\u03B4\u03B1 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "\u0395\u03C0\u03B9\u03BB\u03AD\u03BE\u03C4\u03B5 \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1, \u03B7 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7 \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ".concat(formattedDate)
            : 'Επιλέξτε ημερομηνία';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0395\u03C0\u03B9\u03BB\u03AD\u03BE\u03C4\u03B5 \u03CE\u03C1\u03B1, \u03B7 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7 \u03CE\u03C1\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ".concat(formattedTime) : 'Επιλέξτε ώρα';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'επιλέξτε ώρα',
    dateTableLabel: 'επιλέξτε ημερομηνία',
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
    year: 'Χρόνος',
    month: 'Μήνας',
    day: 'Ημέρα',
    weekDay: 'Καθημερινή',
    hours: 'Ώρες',
    minutes: 'Λεπτά',
    seconds: 'Δευτερόλεπτα',
    meridiem: 'Προ Μεσημβρίας',
    // Common
    // empty: 'Empty',
};
exports.elGR = (0, getPickersLocalization_1.getPickersLocalization)(elGRPickers);
