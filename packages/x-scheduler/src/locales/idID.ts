import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const idIDDialog: SchedulerDialogTranslations = {
  // EventDialog
  // colorPickerLabel: 'Event color',
  // colorSectionLabel: 'Color',
  // dateTimeSectionLabel: 'Date & time',
  // resourceColorSectionLabel: 'Resource & color',
  // allDayLabel: 'All Day',
  // closeButtonAriaLabel: 'Close',
  // closeButtonLabel: 'Close',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  // deleteEvent: 'Delete event',
  // deleteConfirmationTitle: 'Delete this event?',
  // deleteConfirmationMessage: 'This action is irreversible. Are you sure you want to proceed?',
  // cancel: 'Cancel',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  // descriptionLabel: 'Description',
  // endDateLabel: 'End date',
  // endTimeLabel: 'End time',
  // eventTitleAriaLabel: 'Event title',
  // generalTabLabel: 'General',
  // labelNoResource: 'No resource',
  // labelInvalidResource: 'Invalid resource',
  // recurrenceLabel: 'Recurrence',
  // recurrenceNoRepeat: "Don't repeat",
  // recurrenceCustomRepeat: 'Custom repeat rule',
  // recurrenceDailyPresetLabel: 'Repeats daily',
  // recurrenceDailyFrequencyLabel: 'days',
  // recurrenceEndsLabel: 'Ends',
  // recurrenceEndsAfterLabel: 'After',
  // recurrenceEndsNeverLabel: 'Never',
  // recurrenceEndsUntilLabel: 'Until',
  // recurrenceEndsTimesLabel: 'times',
  // recurrenceEveryLabel: 'Every',
  // recurrenceRepeatLabel: 'Repeat',
  // recurrenceTabLabel: 'Recurrence',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  // recurrenceMainSelectCustomLabel: 'Recurrence',
  // recurrenceWeeklyFrequencyLabel: 'weeks',
  // recurrenceWeeklyPresetLabel: ({
  //   weekdayName
  // }) => `Repeats weekly on ${weekdayName}`,
  // recurrenceMonthlyFrequencyLabel: 'months',
  // recurrenceMonthlyDayOfMonthLabel: dayNumber => `Day ${dayNumber}`,
  // recurrenceMonthlyLastWeekAriaLabel: ({
  //   weekdayName
  // }) => `${weekdayName} of the last week of the month`,
  // recurrenceMonthlyLastWeekLabel: ({
  //   weekdayName
  // }) => `${weekdayName} last week`,
  // recurrenceMonthlyPresetLabel: dayNumber => `Repeats monthly on day ${dayNumber}`,
  // recurrenceMonthlyWeekNumberAriaLabel: ({
  //   ord,
  //   weekdayName
  // }) => `${weekdayName} week ${ord} of the month`,
  // recurrenceMonthlyWeekNumberLabel: ({
  //   ord,
  //   weekdayName
  // }) => `${weekdayName} week ${ord}`,
  // recurrenceWeeklyMonthlySpecificInputsLabel: 'On',
  // recurrenceYearlyFrequencyLabel: 'years',
  // recurrenceYearlyPresetLabel: date => `Repeats annually on ${date}`,
  // noResourceAriaLabel: 'No specific resource',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  // resourceLabel: 'Resource',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  // saveChanges: 'Save',
  // startDateAfterEndDateError: 'End date cannot be before start date.',
  // startDateLabel: 'Start date',
  // startTimeAfterEndTimeError: 'End time must be after start time.',
  // startTimeLabel: 'Start time',
  // RecurringScopeDialog
  // all: 'All events',
  // confirm: 'Confirm',
  // onlyThis: 'Only this event',
  // radioGroupAriaLabel: 'Editing recurring events scope',
  // thisAndFollowing: 'This and following events',
  // title: 'Apply this change to:',
  // Errors
  // somethingWentWrongError: 'Something went wrong. Try again.',
  // eventNotLoadedError: 'This event is still being saved, so the change was not applied. Try again once it is saved.',
  // eventChangedWhileConfirmingError: 'This event changed while the delete confirmation was open, so the deletion was not applied. Try deleting it again.',
  // datesNotWritableError: "This date can't be changed, so the change was not applied.",
  // eventNotCreatableError: "This can't be saved as a new event, so the change was not applied.",
  // readOnlyEventMovedError: title => `This change would move the read-only event "${title}", so it was not applied.`,
  // unwritableEventMovedError: title => `This change would move the event "${title}", whose dates can't be edited, so it was not applied.`,
  // dependencyCascadeBlockedError: 'This dependency would move a read-only event, so it was not created.',
  // dependencyDatesNotWritableError: "This dependency would move an event whose dates can't be changed, so it was not created.",
  // dependencyCycleError: 'This dependency would create a cycle between events.',
  // dependencyDuplicateError: 'A dependency of this type already exists between these two events.',
  // dependencyRecurringEventError: 'Dependencies cannot involve recurring events.',
  // dependencyReadOnlyError: 'Dependencies cannot be changed while the scheduler is read-only.',
  // dependencyUnknownEventError: 'This dependency cannot be created because one of its events no longer exists.',
};

const idIDEvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  // resourceAriaLabel: resourceName => `Resource: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const idIDCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  // resourcesLabel: 'Resources',
  // ViewSwitcher
  // agenda: 'Agenda',
  // day: 'Day',
  // month: 'Month',
  // other: 'Other',
  // today: 'Today',
  // week: 'Week',
  // time: 'Time',
  // days: 'Days',
  // months: 'Months',
  // weeks: 'Weeks',
  // years: 'Years',
  // viewSwitcherAriaLabel: 'Views',
  // DateNavigator
  // closeSidePanel: 'Close side panel',
  // openSidePanel: 'Open side panel',
  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',
  // Preferences menu
  // amPm12h: '12-hour (1:00PM)',
  // hour24h: '24-hour (13:00)',
  // preferencesMenu: 'Preferences',
  // showWeekends: 'Show weekends',
  // showEmptyDaysInAgenda: 'Show empty days',
  // showWeekNumber: 'Show week number',
  // timeFormat: 'Time format',
  // viewSpecificOptions: view => `${view} view options`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',
  // WeekView
  // allDay: 'All day',
  // dayGridLabel: 'All-day and multi-day events',
  // hiddenEvents: hiddenEventsCount => `${hiddenEventsCount} more..`,
  // nextTimeSpan: timeSpan => `Next ${timeSpan}`,
  // previousTimeSpan: timeSpan => `Previous ${timeSpan}`,
  // weekAbbreviation: 'W',
  // weekNumberAriaLabel: weekNumber => `Week ${weekNumber}`,
  // AgendaView
  // agendaViewEmptyStateLabel: 'No upcoming events',
  // EventItem
  // eventItemMultiDayLabel: endDate => `Ends ${endDate}`,
  // MiniCalendar
  // miniCalendarLabel: 'Calendar',
  // miniCalendarGoToPreviousMonth: 'Show previous month in calendar',
  // miniCalendarGoToNextMonth: 'Show next month in calendar',
  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',
  // Timeline title sub grid
  // timelineResourceTitleHeader: 'Resource title',
};

const idIDTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  // timelineResourceTitleHeader: 'Resource title',
  // Dependency dialog
  // dependencyEditTitle: 'Edit dependency',
  // dependencyDetailsTitle: 'Dependency details',
  // dependencySourceLabel: 'From',
  // dependencyTargetLabel: 'To',
  // dependencyTypeLabel: 'Type',
  // dependencyLagLabel: 'Lag',
  // dependencyLagUnitAriaLabel: 'Lag unit',
  // dependencyNoLag: 'None',
  // dependencyInvalidLagError: 'Enter a whole number, 0 or more.',
  // dependencyAllDayLagIgnored: 'An all-day event can only wait whole days, so this lag adds no wait.',
  // dependencyAllDayLagRounded: lag => `An all-day event can only wait whole days: ${lag}.`,
  // dependencyUpdateCascadeBlockedError: 'This change would move a read-only event, so it was not applied.',
  // dependencyUpdateDatesNotWritableError: "This change would move an event whose dates can't be changed, so it was not applied.",
  // dependencyUpdateNotFoundError: 'This dependency no longer exists.',
  // dependencyTypeFinishToStart: 'Finish to start',
  // dependencyTypeStartToStart: 'Start to start',
  // dependencyTypeFinishToFinish: 'Finish to finish',
  // dependencyTypeStartToFinish: 'Start to finish',
  // dependencyLagUnitMinutes: 'minutes',
  // dependencyLagUnitHours: 'hours',
  // dependencyLagUnitDays: 'days',
  // dependencyLagUnitWeeks: 'weeks',
  // dependencyLag: (amount, unit) => `${amount} ${unit}${amount === 1 ? '' : 's'}`,
  // Dependency context menu and dialog actions
  // dependencyActionsAriaLabel: 'Dependency actions',
  // editDependency: 'Edit dependency',
  // showDependencyDetails: 'Show details',
  // deleteDependency: 'Delete',
  // Accessible description of an event that waits on dependencies
  // dependencyFinishToStartDescription: ({
  //   title,
  //   lag
  // }) => `Cannot start until ${lag === null ? '' : `${lag} after `}${title} finishes.`,
  // dependencyStartToStartDescription: ({
  //   title,
  //   lag
  // }) => `Cannot start until ${lag === null ? '' : `${lag} after `}${title} starts.`,
  // dependencyFinishToFinishDescription: ({
  //   title,
  //   lag
  // }) => `Cannot finish until ${lag === null ? '' : `${lag} after `}${title} finishes.`,
  // dependencyStartToFinishDescription: ({
  //   title,
  //   lag
  // }) => `Cannot finish until ${lag === null ? '' : `${lag} after `}${title} starts.`,
};

export const idID: SchedulerLocalization = getSchedulerLocalization({
  dialog: idIDDialog,
  event: idIDEvent,
  calendar: idIDCalendar,
  timeline: idIDTimeline,
});
