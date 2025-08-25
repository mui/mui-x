"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plPL = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'godzin',
    minutes: 'minut',
    seconds: 'sekund',
    meridiem: 'popołudnie',
};
var plPLPickers = {
    // Calendar navigation
    previousMonth: 'Poprzedni miesiąc',
    nextMonth: 'Następny miesiąc',
    // View navigation
    openPreviousView: 'Otwórz poprzedni widok',
    openNextView: 'Otwórz następny widok',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'otwarty jest widok roku, przełącz na widok kalendarza'
            : 'otwarty jest widok kalendarza, przełącz na widok roku';
    },
    // DateRange labels
    start: 'Początek',
    end: 'Koniec',
    startDate: 'Data rozpoczęcia',
    startTime: 'Czas rozpoczęcia',
    endDate: 'Data zakończenia',
    endTime: 'Czas zakończenia',
    // Action bar
    cancelButtonLabel: 'Anuluj',
    clearButtonLabel: 'Wyczyść',
    okButtonLabel: 'Zatwierdź',
    todayButtonLabel: 'Dzisiaj',
    nextStepButtonLabel: 'Następny',
    // Toolbar titles
    datePickerToolbarTitle: 'Wybierz datę',
    dateTimePickerToolbarTitle: 'Wybierz datę i czas',
    timePickerToolbarTitle: 'Wybierz czas',
    dateRangePickerToolbarTitle: 'Wybierz zakres dat',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Wybierz ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Nie wybrano czasu' : "Wybrany czas to ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " godzin"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minut"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekund"); },
    // Digital clock labels
    selectViewText: function (view) { return "Wybierz ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Numer tygodnia',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Tydzie\u0144 ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Wybierz dat\u0119, obecnie wybrana data to ".concat(formattedDate) : 'Wybierz datę';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Wybierz czas, obecnie wybrany czas to ".concat(formattedTime) : 'Wybierz czas';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Wyczyść',
    // Table labels
    timeTableLabel: 'wybierz czas',
    dateTableLabel: 'wybierz datę',
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
    year: 'Rok',
    month: 'Miesiąc',
    day: 'Dzień',
    weekDay: 'Dzień tygodnia',
    hours: 'Godzin',
    minutes: 'Minut',
    seconds: 'Sekund',
    // meridiem: 'Meridiem',
    // Common
    // empty: 'Empty',
};
exports.plPL = (0, getPickersLocalization_1.getPickersLocalization)(plPLPickers);
