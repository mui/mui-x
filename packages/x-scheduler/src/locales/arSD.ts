import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const colorNames: Record<string, string> = {
  red: 'الأحمر',
  pink: 'الوردي',
  purple: 'البنفسجي',
  indigo: 'النيلي',
  blue: 'الأزرق',
  teal: 'الأزرق المخضر',
  green: 'الأخضر',
  lime: 'الليموني',
  amber: 'الكهرماني',
  orange: 'البرتقالي',
  grey: 'الرمادي',
};

const viewNames: Record<string, string> = {
  day: 'اليوم',
  week: 'الأسبوع',
  month: 'الشهر',
  agenda: 'جدول الأعمال',
};

const arSDDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'لون الحدث',
  colorSectionLabel: 'اللون',
  dateTimeSectionLabel: 'التاريخ والوقت',
  resourceColorSectionLabel: 'المورد واللون',
  allDayLabel: 'طوال اليوم',
  closeButtonAriaLabel: 'إغلاق',
  closeButtonLabel: 'إغلاق',
  editEventButtonAriaLabel: 'تعديل الحدث',
  deleteEventButtonAriaLabel: 'حذف الحدث',
  eventActionsToolbarAriaLabel: 'إجراءات الحدث',
  deleteEvent: 'حذف الحدث',
  deleteConfirmationTitle: 'حذف هذا الحدث؟',
  deleteConfirmationMessage: 'لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد من أنك تريد المتابعة؟',
  cancel: 'إلغاء',
  editEvent: 'تعديل الحدث',
  showEventDetails: 'إظهار التفاصيل',
  eventContextMenuAriaLabel: 'إجراءات الحدث',
  descriptionLabel: 'الوصف',
  endDateLabel: 'تاريخ الانتهاء',
  endTimeLabel: 'وقت الانتهاء',
  eventTitleAriaLabel: 'عنوان الحدث',
  generalTabLabel: 'عام',
  labelNoResource: 'بدون مورد',
  labelInvalidResource: 'مورد غير صالح',
  recurrenceLabel: 'التكرار',
  recurrenceNoRepeat: 'لا يتكرر',
  recurrenceCustomRepeat: 'قاعدة تكرار مخصصة',
  recurrenceDailyPresetLabel: 'يتكرر يوميًا',
  recurrenceDailyFrequencyLabel: 'أيام',
  recurrenceEndsLabel: 'الانتهاء',
  recurrenceEndsAfterLabel: 'بعد',
  recurrenceEndsNeverLabel: 'لا ينتهي',
  recurrenceEndsUntilLabel: 'حتى',
  recurrenceEndsTimesLabel: 'مرات',
  recurrenceEveryLabel: 'كل',
  recurrenceRepeatLabel: 'التكرار',
  recurrenceTabLabel: 'التكرار',
  recurrenceTimezoneLabel: (timezone) => `المنطقة الزمنية: ${timezone}`,
  recurrenceLabelTimezoneSuffix: (timezone) => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'التكرار',
  recurrenceWeeklyFrequencyLabel: 'أسابيع',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `يتكرر أسبوعيًا يوم ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'أشهر',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `اليوم ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) =>
    `${weekdayName} من الأسبوع الأخير من الشهر`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} من الأسبوع الأخير`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `يتكرر شهريًا في اليوم ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `${weekdayName} في الأسبوع ${ord} من الشهر`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName} في الأسبوع ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'في',
  recurrenceYearlyFrequencyLabel: 'سنوات',
  recurrenceYearlyPresetLabel: (date) => `يتكرر سنويًا في ${date}`,
  noResourceAriaLabel: 'لا يوجد مورد محدد',
  selectColorAriaLabel: (color) => `اختر ${colorNames[color] ?? color} كلون للحدث`,
  resourceLabel: 'المورد',
  invalidDateError: 'أدخل تاريخًا صالحًا.',
  invalidTimeError: 'أدخل وقتًا صالحًا.',
  requiredResourceError: 'المورد مطلوب.',
  saveChanges: 'حفظ',
  startDateAfterEndDateError: 'لا يمكن أن يكون تاريخ الانتهاء قبل تاريخ البدء.',
  startDateLabel: 'تاريخ البدء',
  startTimeAfterEndTimeError: 'يجب أن يكون وقت الانتهاء بعد وقت البدء.',
  startTimeLabel: 'وقت البدء',

  // RecurringScopeDialog
  all: 'كل الأحداث',
  confirm: 'تأكيد',
  onlyThis: 'هذا الحدث فقط',
  radioGroupAriaLabel: 'نطاق تعديل الأحداث المتكررة',
  thisAndFollowing: 'هذا الحدث والأحداث التالية',
  title: 'تطبيق هذا التغيير على:',
};

const arSDEvent: SchedulerEventTranslations = {
  // Event accessible name
  eventAriaLabelTimeRange: (start, end) => `من ${start} إلى ${end}`,
  eventAriaLabelDateRange: (start, end) => `من ${start} إلى ${end}`,
  eventAriaLabelAllDay: 'طوال اليوم',
  eventAriaLabelRecurring: 'متكرر',
  resourceAriaLabel: (resourceName) => `المورد: ${resourceName}`,
  eventAriaLabel: ({ title, when, date, resource, recurring }) =>
    [title, when, date, resource, recurring].filter(Boolean).join('، '),
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
  viewSpecificOptions: (view) => `خيارات عرض ${viewNames[view] ?? view}`,
  startWeekOn: 'أول يوم في الأسبوع',
  weekdaySunday: 'الأحد',
  weekdayMonday: 'الاثنين',
  weekdaySaturday: 'السبت',

  // WeekView
  allDay: 'طوال اليوم',
  dayGridLabel: 'الأحداث التي تستمر طوال اليوم والأحداث الممتدة على عدة أيام',
  hiddenEvents: (hiddenEventsCount) => {
    if (hiddenEventsCount === 1) {
      return 'حدث آخر..';
    }
    if (hiddenEventsCount === 2) {
      return 'حدثان آخران..';
    }
    if (hiddenEventsCount <= 10) {
      return `${hiddenEventsCount} أحداث أخرى..`;
    }
    return `${hiddenEventsCount} حدثًا آخر..`;
  },
  nextTimeSpan: (view) =>
    ({
      day: 'اليوم التالي',
      week: 'الأسبوع التالي',
      month: 'الشهر التالي',
      agenda: 'الفترة التالية',
    })[view],
  previousTimeSpan: (view) =>
    ({
      day: 'اليوم السابق',
      week: 'الأسبوع السابق',
      month: 'الشهر السابق',
      agenda: 'الفترة السابقة',
    })[view],
  weekAbbreviation: 'أ',
  weekNumberAriaLabel: (weekNumber) => `الأسبوع ${weekNumber}`,

  // AgendaView
  agendaViewEmptyStateLabel: 'لا توجد أحداث قادمة',

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
