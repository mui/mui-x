import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const arSDDialog: SchedulerDialogTranslations = {
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
};

const arSDEvent: SchedulerEventTranslations = {
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

const arSDCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'الموارد',

  // ViewSwitcher
  agenda: 'جدول الأعمال',
  day: 'يوم',
  month: 'شهر',
  other: 'أخرى',
  today: 'اليوم',
  week: 'أسبوع',
  time: 'الوقت',
  days: 'أيام',
  months: 'أشهر',
  weeks: 'أسابيع',
  years: 'سنوات',

  // DateNavigator
  closeSidePanel: 'إغلاق اللوحة الجانبية',
  openSidePanel: 'فتح اللوحة الجانبية',

  // SidePanelDrawer (small screens)
  openMenu: 'فتح القائمة',

  // Preferences menu
  amPm12h: 'نظام 12 ساعة (1:00 مساءً)',
  hour24h: 'نظام 24 ساعة (13:00)',
  preferencesMenu: 'التفضيلات',
  showWeekends: 'إظهار عطلات نهاية الأسبوع',
  showEmptyDaysInAgenda: 'إظهار الأيام الفارغة',
  showWeekNumber: 'إظهار رقم الأسبوع',
  timeFormat: 'تنسيق الوقت',
  viewSpecificOptions: (view) => `${view} خيارات العرض`,
  startWeekOn: 'بدء الأسبوع يوم',
  weekdaySunday: 'الأحد',
  weekdayMonday: 'الاثنين',
  weekdaySaturday: 'السبت',

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
  eventItemMultiDayLabel: (endDate) => `ينتهي في ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'التقويم',
  miniCalendarGoToPreviousMonth: 'إظهار الشهر السابق في التقويم',
  miniCalendarGoToNextMonth: 'إظهار الشهر التالي في التقويم',

  // Main calendar region
  calendarContentAriaLabel: 'محتوى التقويم',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'عنوان المورد',
};

const arSDTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'عنوان المورد',
};

export const arSD: SchedulerLocalization = getSchedulerLocalization({
  dialog: arSDDialog,
  event: arSDEvent,
  calendar: arSDCalendar,
  timeline: arSDTimeline,
});
