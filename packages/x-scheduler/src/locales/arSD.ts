import type {
  EventEditingLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type { SchedulerLocalization } from '../utils/getSchedulerLocalization';

const arSDDialog: Partial<EventEditingLocaleText> = {
  // EventDialog
  colorPickerLabel: 'لون الحدث',
  colorSectionLabel: 'اللون',
  dateTimeSectionLabel: 'الوقت و التاريخ',
  resourceColorSectionLabel: 'مورد و لون',
  allDayLabel: 'طوال اليوم',
  closeButtonAriaLabel: 'إغلاق',
  closeButtonLabel: 'إغلاق',
  editEventButtonAriaLabel: 'تعديل الحدث',
  deleteEventButtonAriaLabel: 'حذف الحدث',
  eventActionsToolbarAriaLabel: 'إجراءات الحدث',
  deleteEvent: 'حذف الحدث',
  editEvent: 'تعديل الحدث',
  showEventDetails: 'التفاصيل',
  eventContextMenuAriaLabel: 'إجراءات الحدث',
  descriptionLabel: 'الوصف',
  endDateLabel: 'تاريخ النهاية',
  endTimeLabel: 'وقت النهاية',
  eventTitleAriaLabel: 'عنوان الحدث',
  generalTabLabel: 'عام',
  labelNoResource: 'لا يوجد موارد',
  labelInvalidResource: 'مورد غير صالح',
  recurrenceLabel: 'التكرار',
  recurrenceNoRepeat: 'لا تكرر',
  recurrenceCustomRepeat: 'قاعدة تكرار مخصصة',
  recurrenceDailyPresetLabel: 'تكرار يومي',
  recurrenceDailyFrequencyLabel: 'الايم',
  recurrenceEndsLabel: 'النهاية',
  recurrenceEndsAfterLabel: 'بعد',
  recurrenceEndsNeverLabel: 'لا تنتهي',
  recurrenceEndsUntilLabel: 'حتى',
  recurrenceEndsTimesLabel: 'اوقات',
  recurrenceEveryLabel: 'كل',
  recurrenceRepeatLabel: 'تكرار',
  recurrenceTabLabel: 'التكرار',
  recurrenceMainSelectCustomLabel: 'التكرار',
  recurrenceWeeklyFrequencyLabel: 'الاسابيع',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `يتكرر اسبوعيا في ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'شهور',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `يوم ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} من الاسبوع الاخير في الشهر`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} الاسبوع الاخير`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `يتكرر شهريا في يوم ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} الايبوع ${ord} من الشهر`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} الاسبوع ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'في',
  recurrenceYearlyFrequencyLabel: 'سنوات',
  recurrenceYearlyPresetLabel: (date) => `يتكرر سنويا في ${date}`,
  noResourceAriaLabel: 'لا يوجد مورد محدد',
  selectColorAriaLabel: (color) => `اختار ${color} كلون الحدث`,
  resourceLabel: 'مورد',
  invalidDateError: 'ادخل تاريخ صالح.',
  invalidTimeError: 'ادخل وقت صالح.',
  requiredResourceError: 'المورد مطلوب.',
  saveChanges: 'حفظ',
  startDateAfterEndDateError: 'تاريخ الانتهاء لا يمكن ان يكون قبل تاريخ البدأ.',
  startDateLabel: 'تاريخ البدأ',
  startTimeAfterEndTimeError: 'وقت الانتهاء يجب ان يكون بعد وقت البدأ..',
  startTimeLabel: 'وقت البدأ',

  // RecurringScopeDialog
  all: 'كل الاحداث',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  onlyThis: 'هذا الحدث فقط',
  radioGroupAriaLabel: 'نطاق تعديل الأحداث المتكررة',
  thisAndFollowing: 'هذا الحدث والأحداث التالية',
  title: 'طبّق هذا التغيير على:',
};

const arSDCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventEditingLocaleText>> = {
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
  allDay: 'طوال اليوم',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} المزيد..`,
  nextTimeSpan: (timeSpan) => `التالي ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `السابق ${timeSpan}`,
  resourceAriaLabel: (resourceName) => `المورد: ${resourceName}`,
  weekAbbreviation: 'W',
  weekNumberAriaLabel: (weekNumber) => `أسبوع ${weekNumber}`,

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

const arSDTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventEditingLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'عنوان المورد',
};

export const arSD: SchedulerLocalization = getSchedulerLocalization({
  dialog: arSDDialog,
  calendar: arSDCalendar,
  timeline: arSDTimeline,
});
