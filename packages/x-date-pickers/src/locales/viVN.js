"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viVN = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'giờ',
    minutes: 'phút',
    seconds: 'giây',
    meridiem: 'buổi',
};
var viVNPickers = {
    // Calendar navigation
    previousMonth: 'Tháng trước',
    nextMonth: 'Tháng sau',
    // View navigation
    openPreviousView: 'Mở xem trước',
    openNextView: 'Mở xem sau',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'đang mở xem năm, chuyển sang xem lịch'
            : 'đang mở xem lịch, chuyển sang xem năm';
    },
    // DateRange labels
    start: 'Bắt đầu',
    end: 'Kết thúc',
    startDate: 'Ngày bắt đầu',
    startTime: 'Thời gian bắt đầu',
    endDate: 'Ngày kết thúc',
    endTime: 'Thời gian kết thúc',
    // Action bar
    cancelButtonLabel: 'Hủy',
    clearButtonLabel: 'Xóa',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Hôm nay',
    nextStepButtonLabel: 'Sau',
    // Toolbar titles
    datePickerToolbarTitle: 'Chọn ngày',
    dateTimePickerToolbarTitle: 'Chọn ngày và giờ',
    timePickerToolbarTitle: 'Chọn giờ',
    dateRangePickerToolbarTitle: 'Chọn khoảng ngày',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Ch\u1ECDn ".concat(views[view], ". ").concat(!formattedTime ? 'Không có giờ được chọn' : "Gi\u1EDD \u0111\u01B0\u1EE3c ch\u1ECDn l\u00E0 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " gi\u1EDD"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " ph\u00FAt"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " gi\u00E2y"); },
    // Digital clock labels
    selectViewText: function (view) { return "Ch\u1ECDn ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Số tuần',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Tu\u1EA7n ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Ch\u1ECDn ng\u00E0y, ng\u00E0y \u0111\u00E3 ch\u1ECDn l\u00E0 ".concat(formattedDate) : 'Chọn ngày';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Ch\u1ECDn gi\u1EDD, gi\u1EDD \u0111\u00E3 ch\u1ECDn l\u00E0 ".concat(formattedTime) : 'Chọn giờ';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Xóa giá trị',
    // Table labels
    timeTableLabel: 'chọn giờ',
    dateTableLabel: 'chọn ngày',
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
    year: 'Năm',
    month: 'Tháng',
    day: 'Ngày',
    weekDay: 'Thứ',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây',
    meridiem: 'Buổi',
    // Common
    empty: 'Trống',
};
exports.viVN = (0, getPickersLocalization_1.getPickersLocalization)(viVNPickers);
