"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bnBD = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'ঘণ্টা',
    minutes: 'মিনিট',
    seconds: 'সেকেন্ড',
    meridiem: 'এএম/পিএম',
};
var bnBDPickers = {
    // Calendar navigation
    previousMonth: 'আগের মাস',
    nextMonth: 'পরের মাস',
    // View navigation
    openPreviousView: 'আগের ভিউ খুলুন',
    openNextView: 'পরের ভিউ খুলুন',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'বছরের ভিউ খোলা আছে, ক্যালেন্ডার ভিউতে পরিবর্তন করুন'
            : 'ক্যালেন্ডার ভিউ খোলা আছে, বছরের ভিউতে পরিবর্তন করুন';
    },
    // DateRange labels
    start: 'শুরু',
    end: 'শেষ',
    startDate: 'শুরুর তারিখ',
    startTime: 'শুরুর সময়',
    endDate: 'শেষের তারিখ',
    endTime: 'শেষের সময়',
    // Action bar
    cancelButtonLabel: 'বাতিল',
    clearButtonLabel: 'পরিষ্কার',
    okButtonLabel: 'ঠিক আছে',
    todayButtonLabel: 'আজ',
    nextStepButtonLabel: 'পরের',
    // Toolbar titles
    datePickerToolbarTitle: 'তারিখ নির্বাচন করুন',
    dateTimePickerToolbarTitle: 'তারিখ ও সময় নির্বাচন করুন',
    timePickerToolbarTitle: 'সময় নির্বাচন করুন',
    dateRangePickerToolbarTitle: 'তারিখের পরিসীমা নির্বাচন করুন',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8 ".concat(views[view], ". ").concat(!formattedTime ? 'কোনও সময় নির্বাচন করা হয়নি' : "\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09B8\u09AE\u09AF\u09BC ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0998\u09A3\u09CD\u099F\u09BE"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u09AE\u09BF\u09A8\u09BF\u099F"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u09B8\u09C7\u0995\u09C7\u09A8\u09CD\u09A1"); },
    // Digital clock labels
    selectViewText: function (view) { return "".concat(views[view], " \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'সপ্তাহ সংখ্যা',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u09A4\u09BE\u09B0\u09BF\u0996 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8, \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09A4\u09BE\u09B0\u09BF\u0996 ".concat(formattedDate) : 'তারিখ নির্বাচন করুন';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u09B8\u09AE\u09AF\u09BC \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8, \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09B8\u09AE\u09AF\u09BC ".concat(formattedTime) : 'সময় নির্বাচন করুন';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'পরিষ্কার',
    // Table labels
    timeTableLabel: 'সময় নির্বাচন করুন',
    dateTableLabel: 'তারিখ নির্বাচন করুন',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'ব'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'ঘন্টা'; },
    fieldMinutesPlaceholder: function () { return 'মিনিট'; },
    fieldSecondsPlaceholder: function () { return 'সেকেন্ড'; },
    fieldMeridiemPlaceholder: function () { return 'এএম/পিএম'; },
    // View names
    year: 'বছর',
    month: 'মাস',
    day: 'দিন',
    weekDay: 'সপ্তাহের দিন',
    hours: 'ঘণ্টা',
    minutes: 'মিনিট',
    seconds: 'সেকেন্ড',
    meridiem: 'এএম/পিএম',
    // Common
    empty: 'ফাঁকা',
};
exports.bnBD = (0, getPickersLocalization_1.getPickersLocalization)(bnBDPickers);
