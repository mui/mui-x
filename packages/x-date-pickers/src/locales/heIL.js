"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heIL = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'שעות',
    minutes: 'דקות',
    seconds: 'שניות',
    meridiem: 'מרידיאם',
};
var heILPickers = {
    // Calendar navigation
    previousMonth: 'חודש קודם',
    nextMonth: 'חודש הבא',
    // View navigation
    openPreviousView: 'תצוגה קודמת',
    openNextView: 'תצוגה הבאה',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'תצוגת שנה פתוחה, מעבר לתצוגת לוח שנה'
            : 'תצוגת לוח שנה פתוחה, מעבר לתצוגת שנה';
    },
    // DateRange labels
    start: 'תחילה',
    end: 'סיום',
    startDate: 'תאריך תחילה',
    startTime: 'שעת תחילה',
    endDate: 'תאריך סיום',
    endTime: 'שעת סיום',
    // Action bar
    cancelButtonLabel: 'ביטול',
    clearButtonLabel: 'ניקוי',
    okButtonLabel: 'אישור',
    todayButtonLabel: 'היום',
    nextStepButtonLabel: 'הבא',
    // Toolbar titles
    datePickerToolbarTitle: 'בחירת תאריך',
    dateTimePickerToolbarTitle: 'בחירת תאריך ושעה',
    timePickerToolbarTitle: 'בחירת שעה',
    dateRangePickerToolbarTitle: 'בחירת טווח תאריכים',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "\u05D1\u05D7\u05D9\u05E8\u05EA ".concat(views[view], ". ").concat(!formattedTime ? 'לא נבחרה שעה' : "\u05D4\u05E9\u05E2\u05D4 \u05D4\u05E0\u05D1\u05D7\u05E8\u05EA \u05D4\u05D9\u05D0 ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " \u05E9\u05E2\u05D5\u05EA"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " \u05D3\u05E7\u05D5\u05EA"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " \u05E9\u05E0\u05D9\u05D5\u05EA"); },
    // Digital clock labels
    selectViewText: function (view) { return "\u05D1\u05D7\u05D9\u05E8\u05EA ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'שבוע מספר',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "\u05E9\u05D1\u05D5\u05E2 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "\u05D1\u05D7\u05D9\u05E8\u05EA \u05EA\u05D0\u05E8\u05D9\u05DA, \u05D4\u05EA\u05D0\u05E8\u05D9\u05DA \u05E9\u05E0\u05D1\u05D7\u05E8 \u05D4\u05D5\u05D0 ".concat(formattedDate) : 'בחירת תאריך';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "\u05D1\u05D7\u05D9\u05E8\u05EA \u05E9\u05E2\u05D4, \u05D4\u05E9\u05E2\u05D4 \u05E9\u05E0\u05D1\u05D7\u05E8\u05D4 \u05D4\u05D9\u05D0 ".concat(formattedTime) : 'בחירת שעה';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'נקה ערך',
    // Table labels
    timeTableLabel: 'בחירת שעה',
    dateTableLabel: 'בחירת תאריך',
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
    year: 'שנה',
    month: 'חודש',
    day: 'יום',
    weekDay: 'יום בשבוע',
    hours: 'שעות',
    minutes: 'דקות',
    seconds: 'שניות',
    meridiem: 'יחידת זמן',
    // Common
    empty: 'ריק',
};
exports.heIL = (0, getPickersLocalization_1.getPickersLocalization)(heILPickers);
