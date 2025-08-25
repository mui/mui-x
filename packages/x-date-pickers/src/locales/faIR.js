"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faIR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'ساعت‌ها',
    minutes: 'دقیقه‌ها',
    seconds: 'ثانیه‌ها',
    meridiem: 'بعد از ظهر',
};
var faIRPickers = {
    // Calendar navigation
    previousMonth: 'ماه گذشته',
    nextMonth: 'ماه آینده',
    // View navigation
    openPreviousView: 'نمای قبلی',
    openNextView: 'نمای بعدی',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'نمای سال باز است، رفتن به نمای تقویم'
            : 'نمای تقویم باز است، رفتن به نمای سال';
    },
    // DateRange labels
    start: 'شروع',
    end: 'پایان',
    startDate: 'تاریخ شروع',
    startTime: 'ساعت شروع',
    endDate: 'تاریخ پایان',
    endTime: 'ساعت پایان',
    // Action bar
    cancelButtonLabel: 'لغو',
    clearButtonLabel: 'پاک کردن',
    okButtonLabel: 'اوکی',
    todayButtonLabel: 'امروز',
    nextStepButtonLabel: 'آینده',
    // Toolbar titles
    datePickerToolbarTitle: 'تاریخ را انتخاب کنید',
    dateTimePickerToolbarTitle: 'تاریخ و ساعت را انتخاب کنید',
    timePickerToolbarTitle: 'ساعت را انتخاب کنید',
    dateRangePickerToolbarTitle: 'محدوده تاریخ را انتخاب کنید',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return " \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F ".concat(timeViews[view], ". ").concat(!formattedTime ? 'هیچ ساعتی انتخاب نشده است' : "\u0633\u0627\u0639\u062A \u0627\u0646\u062A\u062E\u0627\u0628 ".concat(formattedTime, " \u0645\u06CC \u0628\u0627\u0634\u062F"));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u0633\u0627\u0639\u062A\u200C\u0647\u0627"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u062F\u0642\u06CC\u0642\u0647\u200C\u0647\u0627"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u062B\u0627\u0646\u06CC\u0647\u200C\u0647\u0627"); },
    // Digital clock labels
    selectViewText: function (view) { return " \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'عدد هفته',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u0647\u0641\u062A\u0647 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "\u062A\u0627\u0631\u06CC\u062E \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F\u060C \u062A\u0627\u0631\u06CC\u062E \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647 ".concat(formattedDate, " \u0645\u06CC\u200C\u0628\u0627\u0634\u062F")
            : 'تاریخ را انتخاب کنید';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime
            ? "\u0633\u0627\u0639\u062A \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F\u060C \u0633\u0627\u0639\u062A \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647 ".concat(formattedTime, " \u0645\u06CC\u200C\u0628\u0627\u0634\u062F")
            : 'ساعت را انتخاب کنید';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'پاک کردن مقدار',
    // Table labels
    timeTableLabel: 'انتخاب تاریخ',
    dateTableLabel: 'انتخاب ساعت',
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
    year: 'سال',
    month: 'ماه',
    day: 'روز',
    weekDay: 'روز هفته',
    hours: 'ساعت‌ها',
    minutes: 'دقیقه‌ها',
    seconds: 'ثانیه‌ها',
    meridiem: 'نیم‌روز',
    // Common
    empty: 'خالی',
};
exports.faIR = (0, getPickersLocalization_1.getPickersLocalization)(faIRPickers);
