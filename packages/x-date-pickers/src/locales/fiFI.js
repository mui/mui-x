"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fiFI = void 0;
var getPickersLocalization_1 = require("./utils/getPickersLocalization");
var views = {
    hours: 'tunnit',
    minutes: 'minuutit',
    seconds: 'sekuntit',
    meridiem: 'iltapäivä',
};
var fiFIPickers = {
    // Calendar navigation
    previousMonth: 'Edellinen kuukausi',
    nextMonth: 'Seuraava kuukausi',
    // View navigation
    openPreviousView: 'Avaa edellinen näkymä',
    openNextView: 'Avaa seuraava näkymä',
    calendarViewSwitchingButtonAriaLabel: function (view) {
        return view === 'year'
            ? 'vuosinäkymä on auki, vaihda kalenterinäkymään'
            : 'kalenterinäkymä on auki, vaihda vuosinäkymään';
    },
    // DateRange labels
    start: 'Alku',
    end: 'Loppu',
    startDate: 'Alkamispäivämäärä',
    startTime: 'Alkamisaika',
    endDate: 'Päättymispäivämäärä',
    endTime: 'Päättymisaika',
    // Action bar
    cancelButtonLabel: 'Peruuta',
    clearButtonLabel: 'Tyhjennä',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Tänään',
    nextStepButtonLabel: 'Seuraava',
    // Toolbar titles
    datePickerToolbarTitle: 'Valitse päivä',
    dateTimePickerToolbarTitle: 'Valitse päivä ja aika',
    timePickerToolbarTitle: 'Valitse aika',
    dateRangePickerToolbarTitle: 'Valitse aikaväli',
    // timeRangePickerToolbarTitle: 'Select time range',
    // Clock labels
    clockLabelText: function (view, formattedTime) {
        return "Valitse ".concat(views[view], ". ").concat(!formattedTime ? 'Ei aikaa valittuna' : "Valittu aika on ".concat(formattedTime));
    },
    hoursClockNumberText: function (hours) { return "".concat(hours, " tuntia"); },
    minutesClockNumberText: function (minutes) { return "".concat(minutes, " minuuttia"); },
    secondsClockNumberText: function (seconds) { return "".concat(seconds, " sekuntia"); },
    // Digital clock labels
    selectViewText: function (view) { return "Valitse ".concat(views[view]); },
    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Viikko',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: function (weekNumber) { return "Viikko ".concat(weekNumber); },
    calendarWeekNumberText: function (weekNumber) { return "".concat(weekNumber); },
    // Open Picker labels
    openDatePickerDialogue: function (formattedDate) {
        return formattedDate ? "Valitse p\u00E4iv\u00E4, valittu p\u00E4iv\u00E4 on ".concat(formattedDate) : 'Valitse päivä';
    },
    openTimePickerDialogue: function (formattedTime) {
        return formattedTime ? "Valitse aika, valittu aika on ".concat(formattedTime) : 'Valitse aika';
    },
    // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
    fieldClearLabel: 'Tyhjennä arvo',
    // Table labels
    timeTableLabel: 'valitse aika',
    dateTableLabel: 'valitse päivä',
    // Field section placeholders
    fieldYearPlaceholder: function (params) { return 'V'.repeat(params.digitAmount); },
    fieldMonthPlaceholder: function (params) { return (params.contentType === 'letter' ? 'KKKK' : 'KK'); },
    fieldDayPlaceholder: function () { return 'PP'; },
    fieldWeekDayPlaceholder: function (params) { return (params.contentType === 'letter' ? 'EEEE' : 'EE'); },
    fieldHoursPlaceholder: function () { return 'tt'; },
    fieldMinutesPlaceholder: function () { return 'mm'; },
    fieldSecondsPlaceholder: function () { return 'ss'; },
    fieldMeridiemPlaceholder: function () { return 'aa'; },
    // View names
    year: 'Vuosi',
    month: 'Kuukausi',
    day: 'Päivä',
    weekDay: 'Viikonpäivä',
    hours: 'Tunnit',
    minutes: 'Minuutit',
    seconds: 'Sekunnit',
    meridiem: 'Iltapäivä',
    // Common
    empty: 'Tyhjä',
};
exports.fiFI = (0, getPickersLocalization_1.getPickersLocalization)(fiFIPickers);
