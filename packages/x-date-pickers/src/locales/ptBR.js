"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ptBR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var timeViews = {
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
    meridiem: 'meridiano',
};
var ptBRPickers = {
    // Calendar navigation
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    // View navigation
    openPreviousView: 'Abrir seleção anterior',
    openNextView: 'Abrir próxima seleção',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'Seleção de ano está aberta, alternando para seleção de calendário'
            : 'Seleção de calendários está aberta, alternando para seleção de ano';
    },
    // DateRange labels
    start: 'Início',
    end: 'Fim',
    startDate: 'Data de início',
    startTime: 'Hora de início',
    endDate: 'Data de Término',
    endTime: 'Hora de Término',
    // Action bar
    cancelButtonLabel: 'Cancelar',
    clearButtonLabel: 'Limpar',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Hoje',
    nextStepButtonLabel: 'Próximo',
    // Toolbar titles
    datePickerToolbarTitle: 'Selecione a data',
    dateTimePickerToolbarTitle: 'Selecione data e hora',
    timePickerToolbarTitle: 'Selecione a hora',
    dateRangePickerToolbarTitle: 'Selecione o intervalo entre datas',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Selecione ".concat(timeViews[view], ". ").concat(!formattedTime ? 'Hora não selecionada' : "Selecionado a hora ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " horas"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutos"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " segundos"); },
    // Digital clock labels
    selectViewText: function (view) { return "Selecione ".concat(timeViews[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Número da semana',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Semana ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "Escolha uma data, data selecionada ".concat(formattedDate)
            : 'Escolha uma data';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Escolha uma hora, hora selecionada ".concat(formattedTime) : 'Escolha uma hora';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Limpar valor',
    // Table labels
    timeTableLabel: 'escolha uma hora',
    dateTableLabel: 'escolha uma data',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'A'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'DD'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'SSSS' : 'SS'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Ano',
    month: 'Mês',
    day: 'Dia',
    weekDay: 'Dia da Semana',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    meridiem: 'Meio dia',
    // Common
    empty: 'Vazio',
};
exports.ptBR = (0, getPickersLocalization_1.getPickersLocalization)(ptBRPickers);
