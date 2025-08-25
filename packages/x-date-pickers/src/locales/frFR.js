"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frFR = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'heures',
    minutes: 'minutes',
    seconds: 'secondes',
    meridiem: 'méridien',
};
var frFRPickers = {
    // Calendar navigation
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    // View navigation
    openPreviousView: 'Ouvrir la vue précédente',
    openNextView: 'Ouvrir la vue suivante',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'La vue année est ouverte, ouvrir la vue calendrier'
            : 'La vue calendrier est ouverte, ouvrir la vue année';
    },
    // DateRange labels
    start: 'Début',
    end: 'Fin',
    startDate: 'Date de début',
    startTime: 'Heure de début',
    endDate: 'Date de fin',
    endTime: 'Heure de fin',
    // Action bar
    cancelButtonLabel: 'Annuler',
    clearButtonLabel: 'Vider',
    okButtonLabel: 'OK',
    todayButtonLabel: "Aujourd'hui",
    nextStepButtonLabel: 'Suivant',
    // Toolbar titles
    datePickerToolbarTitle: 'Choisir une date',
    dateTimePickerToolbarTitle: "Choisir la date et l'heure",
    timePickerToolbarTitle: "Choisir l'heure",
    dateRangePickerToolbarTitle: 'Choisir la plage de dates',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Choix des ".concat(views[view], ". ").concat(!formattedTime ? 'Aucune heure choisie' : "L'heure choisie est ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " heures"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minutes"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " secondes"); },
    // Digital clock labels
    selectViewText: function (view) { return "Choisir ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Semaine',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Semaine ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate
            ? "Choisir la date, la date s\u00E9lectionn\u00E9e est ".concat(formattedDate)
            : 'Choisir la date';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime
            ? "Choisir l'heure, l'heure s\u00E9lectionn\u00E9e est ".concat(formattedTime)
            : "Choisir l'heure";
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Effacer la valeur',
    // Table labels
    timeTableLabel: "choix de l'heure",
    dateTableLabel: 'choix de la date',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'A'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'MMMM' : 'MM'); },
    fieldDayPlaceholder: function () { return 'JJ'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'hh'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Année',
    month: 'Mois',
    day: 'Jour',
    weekDay: 'Jour de la semaine',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
    meridiem: 'Méridien',
    // Common
    empty: 'Vider',
};
exports.frFR = (0, getPickersLocalization_1.getPickersLocalization)(frFRPickers);
