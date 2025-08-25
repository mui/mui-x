"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caES = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'Hores',
    minutes: 'Minuts',
    seconds: 'Segons',
    meridiem: 'Meridià',
};
var caESPickers = {
    // Calendar navigation
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes següent',
    // View navigation
    openPreviousView: "Obrir l'última vista",
    openNextView: 'Obrir la següent vista',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'la vista anual està oberta, canvia a la vista de calendari'
            : 'la vista de calendari està oberta, canvia a la vista anual';
    },
    // DateRange labels
    start: 'Començar',
    end: 'Terminar',
    startDate: 'Data inicial',
    startTime: 'Hora inicial',
    endDate: 'Data final',
    endTime: 'Hora final',
    // Action bar
    cancelButtonLabel: 'Cancel·lar',
    clearButtonLabel: 'Netejar',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Avuí',
    nextStepButtonLabel: 'Següent',
    // Toolbar titles
    datePickerToolbarTitle: 'Seleccionar data',
    dateTimePickerToolbarTitle: 'Seleccionar data i hora',
    timePickerToolbarTitle: 'Seleccionar hora',
    dateRangePickerToolbarTitle: 'Seleccionar rang de dates',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Selecciona ".concat(views[view], ". ").concat(!formattedTime ? 'Hora no seleccionada' : "L'hora seleccionada \u00E9s ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " hores"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minuts"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " segons"); },
    // Digital clock labels
    selectViewText: function (view) { return "Seleccionar ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Número de la setmana',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Setmana ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Tria la data, la data triada \u00E9s ".concat(formattedDate) : 'Tria la data';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Tria l'hora, l'hora triada \u00E9s ".concat(formattedTime) : "Tria l'hora";
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Netega el valor',
    // Table labels
    timeTableLabel: 'tria la data',
    dateTableLabel: "tria l'hora",
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
    year: 'Any',
    month: 'Mes',
    day: 'Dia',
    weekDay: 'Dia de la setmana',
    hours: 'Hores',
    minutes: 'Minuts',
    seconds: 'Segons',
    meridiem: 'Meridià',
    // Common
    empty: 'Buit',
};
exports.caES = (0, getPickersLocalization_1.getPickersLocalization)(caESPickers);
