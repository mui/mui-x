"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csCZ = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
// maps TimeView to its translation
var timeViews = {
    hours: 'Hodiny',
    minutes: 'Minuty',
    seconds: 'Sekundy',
    meridiem: 'Odpoledne',
};
var csCZPickers = {
    // Calendar navigation
    previousMonth: 'Předchozí měsíc',
    nextMonth: 'Další měsíc',
    // View navigation
    openPreviousView: 'Otevřít předchozí zobrazení',
    openNextView: 'Otevřít další zobrazení',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'roční zobrazení otevřeno, přepněte do zobrazení kalendáře'
            : 'zobrazení kalendáře otevřeno, přepněte do zobrazení roku';
    },
    // DateRange labels
    start: 'Začátek',
    end: 'Konec',
    startDate: 'Datum začátku',
    startTime: 'Čas začátku',
    endDate: 'Datum konce',
    endTime: 'Čas konce',
    // Action bar
    cancelButtonLabel: 'Zrušit',
    clearButtonLabel: 'Vymazat',
    okButtonLabel: 'Potvrdit',
    todayButtonLabel: 'Dnes',
    nextStepButtonLabel: 'Další',
    // Toolbar titles
    datePickerToolbarTitle: 'Vyberte datum',
    dateTimePickerToolbarTitle: 'Vyberte datum a čas',
    timePickerToolbarTitle: 'Vyberte čas',
    dateRangePickerToolbarTitle: 'Vyberte rozmezí dat',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) { var _a; return "".concat((_a = timeViews[view]) !== null && _a !== void 0 ? _a : view, " vybr\u00E1ny. ").concat(!formattedTime ? 'Není vybrán čas' : "Vybran\u00FD \u010Das je ".concat(formattedTime)); },
    hoursClockNumberText: function (hours) { return "".concat(hours, " hodin"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minut"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekund"); },
    // Digital clock labels
    selectViewText: function (view) { return "Vyberte ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Týden v roce',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "".concat(weekNumber, " t\u00FDden v roce"); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Vyberte datum, vybran\u00E9 datum je ".concat(formattedDate) : 'Vyberte datum';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Vyberte \u010Das, vybran\u00FD \u010Das je ".concat(formattedTime) : 'Vyberte čas';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Vymazat',
    // Table labels
    timeTableLabel: 'vyberte čas',
    dateTableLabel: 'vyberte datum',
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
    year: 'Rok',
    month: 'Měsíc',
    day: 'Den',
    weekDay: 'Pracovní den',
    hours: 'Hodiny',
    minutes: 'Minuty',
    seconds: 'Sekundy',
    meridiem: 'Odpoledne',
    // Common
    empty: 'Prázdný',
};
exports.csCZ = (0, getPickersLocalization_1.getPickersLocalization)(csCZPickers);
