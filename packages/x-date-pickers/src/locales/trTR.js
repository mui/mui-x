"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trTR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'saat',
    minutes: 'dakika',
    seconds: 'saniye',
    meridiem: 'öğleden sonra',
};
var trTRPickers = {
    // Calendar navigation
    previousMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
    // View navigation
    openPreviousView: 'Sonraki görünüm',
    openNextView: 'Önceki görünüm',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'yıl görünümü açık, takvim görünümüne geç'
            : 'takvim görünümü açık, yıl görünümüne geç';
    },
    // DateRange labels
    start: 'Başlangıç',
    end: 'Bitiş',
    // startDate: 'Start date',
    // startTime: 'Start time',
    // endDate: 'End date',
    // endTime: 'End time',
    // Action bar
    cancelButtonLabel: 'iptal',
    clearButtonLabel: 'Temizle',
    okButtonLabel: 'Tamam',
    todayButtonLabel: 'Bugün',
    nextStepButtonLabel: 'Sonraki',
    // Toolbar titles
    datePickerToolbarTitle: 'Tarih Seç',
    dateTimePickerToolbarTitle: 'Tarih & Saat seç',
    timePickerToolbarTitle: 'Saat seç',
    dateRangePickerToolbarTitle: 'Tarih aralığı seçin',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "".concat(timeViews[view], " se\u00E7.  ").concat(!formattedTime ? 'Zaman seçilmedi' : "Se\u00E7ilen zaman: ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " saat"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " dakika"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " saniye"); },
    // Digital clock labels
    selectViewText: function (view) { return "Se\u00E7 ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Hafta numarası',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Hafta ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Tarih se\u00E7in, se\u00E7ilen tarih: ".concat(formattedDate) : 'Tarih seç';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Saat se\u00E7in, se\u00E7ilen saat: ".concat(formattedTime) : 'Saat seç';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    // fieldClearLabel: 'Clear',
    // Table labels
    timeTableLabel: 'saat seç',
    dateTableLabel: 'tarih seç',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'Y'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'AAA' : 'AA'); },
    fieldDayPlaceholder: function () { return 'GG'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'HHH' : 'HH'); },
    fieldHoursPlaceholder: function () { return 'ss'; },
    fieldMinutesPlaceholder: function () { return 'dd'; },
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
exports.trTR = (0, getPickersLocalization_1.getPickersLocalization)(trTRPickers);
