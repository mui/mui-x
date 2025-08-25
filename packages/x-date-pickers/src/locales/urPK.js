"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urPK = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ',
    meridiem: 'میریڈیم',
};
var urPKPickers = {
    // Calendar navigation
    previousMonth: 'پچھلا مہینہ',
    nextMonth: 'اگلا مہینہ',
    // View navigation
    openPreviousView: 'پچھلا ویو کھولیں',
    openNextView: 'اگلا ویو کھولیں',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'سال والا ویو کھلا ہے۔ کیلنڈر والا ویو کھولیں'
            : 'کیلنڈر والا ویو کھلا ہے۔ سال والا ویو کھولیں';
    },
    // DateRange labels
    start: 'شروع',
    end: 'ختم',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'کینسل',
    clearButtonLabel: 'کلئیر',
    okButtonLabel: 'اوکے',
    todayButtonLabel: 'آج',
    nextStepButtonLabel: 'مہینہ',
    // Toolbar titles
    datePickerToolbarTitle: 'تاریخ منتخب کریں',
    dateTimePickerToolbarTitle: 'تاریخ اور وقت منتخب کریں',
    timePickerToolbarTitle: 'وقت منتخب کریں',
    dateRangePickerToolbarTitle: 'تاریخوں کی رینج منتخب کریں',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "".concat(timeViews[view], " \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA ").concat(!formattedTime ? 'کوئی وقت منتخب نہیں' : "\u0645\u0646\u062A\u062E\u0628 \u0648\u0642\u062A \u06C1\u06D2 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u06AF\u06BE\u0646\u0679\u06D2"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u0645\u0646\u0679"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u0633\u06CC\u06A9\u0646\u0688"); },
    // Digital clock labels
    selectViewText: function (view) { return "".concat(timeViews[view], " \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA"); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'ہفتہ نمبر',
    calendarWeekNumberHeaderText: 'نمبر',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u06C1\u0641\u062A\u06C1 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u062A\u0627\u0631\u06CC\u062E \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA\u060C \u0645\u0646\u062A\u062E\u0628 \u0634\u062F\u06C1 \u062A\u0627\u0631\u06CC\u062E \u06C1\u06D2 ".concat(formattedDate) : 'تاریخ منتخب کریں';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u0648\u0642\u062A \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA\u060C \u0645\u0646\u062A\u062E\u0628 \u0634\u062F\u06C1 \u0648\u0642\u062A \u06C1\u06D2 ".concat(formattedTime) : 'وقت منتخب کریں';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'وقت منتخب کریں',
    dateTableLabel: 'تاریخ منتخب کریں',
    // Field section placeholders
    // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
    // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
    // fieldDayPlaceholder: () => 'DD',
    // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
    // fieldHoursPlaceholder: () => 'hh',
    // fieldMinutesPlaceholder: () => 'mm',
    // fieldSecondsPlaceholder: () => 'ss',
    // fieldMeridiemPlaceholder: () => 'aa',
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
exports.urPK = (0, getPickersLocalization_1.getPickersLocalization)(urPKPickers);
