"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esES = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    meridiem: 'Meridiano',
};
var esESPickers = {
    // Calendar navigation
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    // View navigation
    openPreviousView: 'Abrir la última vista',
    openNextView: 'Abrir la siguiente vista',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'la vista anual está abierta, cambie a la vista de calendario'
            : 'la vista de calendario está abierta, cambie a la vista anual';
    },
    // DateRange labels
    start: 'Empezar',
    end: 'Terminar',
    startDate: 'Fecha inicio',
    startTime: 'Hora inicio',
    endDate: 'Fecha final',
    endTime: 'Hora final',
    // Action bar
    cancelButtonLabel: 'Cancelar',
    clearButtonLabel: 'Limpiar',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Hoy',
    nextStepButtonLabel: 'Siguiente',
    // Toolbar titles
    datePickerToolbarTitle: 'Seleccionar fecha',
    dateTimePickerToolbarTitle: 'Seleccionar fecha y hora',
    timePickerToolbarTitle: 'Seleccionar hora',
    dateRangePickerToolbarTitle: 'Seleccionar rango de fecha',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Seleccione ".concat(views[view], ". ").concat(!formattedTime ? 'No hay hora seleccionada' : "La hora seleccionada es ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " horas"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutos"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " segundos"); },
    // Digital clock labels
    selectViewText: function (view) { return "Seleccionar ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Número de semana',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Semana ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Elige fecha, la fecha elegida es ".concat(formattedDate) : 'Elige fecha';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Elige hora, la hora elegida es ".concat(formattedTime) : 'Elige hora';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Limpiar valor',
    // Table labels
    timeTableLabel: 'elige hora',
    dateTableLabel: 'elige fecha',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'A'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Año',
    month: 'Mes',
    day: 'Dia',
    weekDay: 'Dia de la semana',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    meridiem: 'Meridiano',
    // Common
    empty: 'Vacío',
};
exports.esES = (0, getPickersLocalization_1.getPickersLocalization)(esESPickers);
