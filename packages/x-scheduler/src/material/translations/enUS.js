"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enUS = void 0;
exports.enUS = {
    // ResourceLegend
    hideEventsLabel: function (resourceName) { return "Hide events for ".concat(resourceName); },
    resourceLegendSectionLabel: 'Resource legend',
    showEventsLabel: function (resourceName) { return "Show events for ".concat(resourceName); },
    // ViewSwitcher
    agenda: 'Agenda',
    day: 'Day',
    month: 'Month',
    other: 'Other',
    today: 'Today',
    week: 'Week',
    // SettingsMenu
    hideWeekends: 'Hide weekends',
    settingsMenu: 'Settings',
    // WeekView
    allDay: 'All day',
    // MonthView
    hiddenEvents: function (hiddenEventsCount) { return "".concat(hiddenEventsCount, " more.."); },
    nextTimeSpan: function (timeSpan) { return "Next ".concat(timeSpan); },
    noResourceAriaLabel: 'No specific resource',
    previousTimeSpan: function (timeSpan) { return "Previous ".concat(timeSpan); },
    resourceAriaLabel: function (resourceName) { return "Resource: ".concat(resourceName); },
    weekAbbreviation: 'W',
    weekNumberAriaLabel: function (weekNumber) { return "Week ".concat(weekNumber); },
    // EventPopover
    allDayLabel: 'All Day',
    closeButtonAriaLabel: 'Close modal',
    deleteEvent: 'Delete event',
    descriptionLabel: 'Description',
    editDisabledNotice: 'Editing is currently unavailable for recurrent events',
    endDateLabel: 'End date',
    endTimeLabel: 'End time',
    eventTitleAriaLabel: 'Event title',
    recurrenceLabel: 'Recurrence',
    recurrenceNoRepeat: "Don't repeat",
    recurrenceDailyPresetLabel: 'Repeats daily',
    recurrenceWeeklyPresetLabel: function (weekday) { return "Repeats weekly on ".concat(weekday); },
    recurrenceMonthlyPresetLabel: function (dayNumber) { return "Repeats monthly on day ".concat(dayNumber); },
    recurrenceYearlyPresetLabel: function (date) { return "Repeats annually on ".concat(date); },
    saveChanges: 'Save changes',
    startDateAfterEndDateError: 'Start date/time must be before end date/time.',
    startDateLabel: 'Start date',
    startTimeLabel: 'Start time',
};
