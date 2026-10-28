import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const colorNames: Record<string, string> = {
  red: 'kırmızı',
  pink: 'pembe',
  purple: 'mor',
  indigo: 'çivit mavisi',
  blue: 'mavi',
  teal: 'turkuaz',
  green: 'yeşil',
  lime: 'limon yeşili',
  amber: 'kehribar',
  orange: 'turuncu',
  grey: 'gri',
};

const viewNames: Record<string, string> = {
  day: 'Gün',
  week: 'Hafta',
  month: 'Ay',
  agenda: 'Ajanda',
};

const timeSpanNames: Record<string, string> = {
  day: 'gün',
  week: 'hafta',
  month: 'ay',
  agenda: 'dönem',
};

const trTRDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Etkinlik rengi',
  colorSectionLabel: 'Renk',
  dateTimeSectionLabel: 'Tarih ve saat',
  resourceColorSectionLabel: 'Kaynak ve renk',
  allDayLabel: 'Tüm gün',
  closeButtonAriaLabel: 'Kapat',
  closeButtonLabel: 'Kapat',
  editEventButtonAriaLabel: 'Etkinliği düzenle',
  deleteEventButtonAriaLabel: 'Etkinliği sil',
  eventActionsToolbarAriaLabel: 'Etkinlik işlemleri',
  deleteEvent: 'Etkinliği sil',
  deleteConfirmationTitle: 'Bu etkinlik silinsin mi?',
  deleteConfirmationMessage: 'Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?',
  cancel: 'İptal',
  editEvent: 'Etkinliği düzenle',
  showEventDetails: 'Ayrıntıları göster',
  eventContextMenuAriaLabel: 'Etkinlik işlemleri',
  descriptionLabel: 'Açıklama',
  endDateLabel: 'Bitiş tarihi',
  endTimeLabel: 'Bitiş saati',
  eventTitleAriaLabel: 'Etkinlik başlığı',
  generalTabLabel: 'Genel',
  labelNoResource: 'Kaynak yok',
  labelInvalidResource: 'Geçersiz kaynak',
  recurrenceLabel: 'Tekrarlama',
  recurrenceNoRepeat: 'Tekrarlanmaz',
  recurrenceCustomRepeat: 'Özel tekrarlama kuralı',
  recurrenceDailyPresetLabel: 'Her gün tekrarlanır',
  recurrenceDailyFrequencyLabel: 'günde bir',
  recurrenceEndsLabel: 'Bitiş',
  recurrenceEndsAfterLabel: 'Toplam',
  recurrenceEndsNeverLabel: 'Hiçbir zaman',
  recurrenceEndsUntilLabel: 'Şu tarihe kadar',
  recurrenceEndsTimesLabel: 'tekrardan sonra',
  recurrenceEveryLabel: 'Her',
  recurrenceRepeatLabel: 'Tekrar',
  recurrenceTabLabel: 'Tekrarlama',
  recurrenceTimezoneLabel: (timezone) => `Saat dilimi: ${timezone}`,
  recurrenceLabelTimezoneSuffix: (timezone) => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Tekrarlama',
  recurrenceWeeklyFrequencyLabel: 'haftada bir',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Her hafta ${weekdayName} günü tekrarlanır`,
  recurrenceMonthlyFrequencyLabel: 'ayda bir',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `${dayNumber}. gün`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) => `Ayın son ${weekdayName} günü`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `Son ${weekdayName}`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Her ayın ${dayNumber}. günü tekrarlanır`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `Ayın ${ord}. ${weekdayName} günü`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${ord}. ${weekdayName}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Şu günlerde',
  recurrenceYearlyFrequencyLabel: 'yılda bir',
  recurrenceYearlyPresetLabel: (date) => `Her yıl ${date} tarihinde tekrarlanır`,
  noResourceAriaLabel: 'Belirli bir kaynak yok',
  selectColorAriaLabel: (color) => `Etkinlik rengi olarak ${colorNames[color] ?? color} seç`,
  resourceLabel: 'Kaynak',
  invalidDateError: 'Geçerli bir tarih girin.',
  invalidTimeError: 'Geçerli bir saat girin.',
  requiredResourceError: 'Kaynak seçimi zorunludur.',
  saveChanges: 'Kaydet',
  startDateAfterEndDateError: 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
  startDateLabel: 'Başlangıç tarihi',
  startTimeAfterEndTimeError: 'Bitiş saati başlangıç saatinden sonra olmalıdır.',
  startTimeLabel: 'Başlangıç saati',

  // RecurringScopeDialog
  all: 'Tüm etkinlikler',
  confirm: 'Onayla',
  onlyThis: 'Yalnızca bu etkinlik',
  radioGroupAriaLabel: 'Tekrarlanan etkinliklerde düzenleme kapsamı',
  thisAndFollowing: 'Bu ve sonraki etkinlikler',
  title: 'Bu değişikliği şunlara uygula:',

  // Errors
  // somethingWentWrongError: 'Something went wrong. Try again.',
  // eventNotLoadedError: 'This event is still being saved, so the change was not applied. Try again once it is saved.',
  // eventChangedWhileConfirmingError: 'This event changed while the delete confirmation was open, so the deletion was not applied. Try deleting it again.',
  // datesNotWritableError: "This date can't be changed, so the change was not applied.",
  // eventNotCreatableError: "This can't be saved as a new event, so the change was not applied.",
  // readOnlyEventMovedError: title => `This change would move the read-only event "${title}", so it was not applied.`,
  // dependencyCascadeBlockedError: 'This dependency would move a read-only event, so it was not created.',
  // dependencyCycleError: 'This dependency would create a cycle between events.',
  // dependencyDuplicateError: 'A dependency of this type already exists between these two events.',
  // dependencyRecurringEventError: 'Dependencies cannot involve recurring events.',
  // dependencyReadOnlyError: 'Dependencies cannot be changed while the scheduler is read-only.',
  // dependencyUnknownEventError: 'This dependency cannot be created because one of its events no longer exists.',
};

const trTREvent: SchedulerEventTranslations = {
  // Event accessible name
  eventAriaLabelTimeRange: (start, end) => `${start} ile ${end} arası`,
  eventAriaLabelDateRange: (start, end) => `${start} ile ${end} arası`,
  eventAriaLabelAllDay: 'Tüm gün',
  eventAriaLabelRecurring: 'Tekrarlanan',
  resourceAriaLabel: (resourceName) => `Kaynak: ${resourceName}`,
  eventAriaLabel: ({ title, when, date, resource, recurring }) =>
    [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const trTRCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Kaynaklar',

  // ViewSwitcher
  agenda: 'Ajanda',
  day: 'Gün',
  month: 'Ay',
  other: 'Diğer',
  today: 'Bugün',
  week: 'Hafta',
  time: 'Saat',
  days: 'Günler',
  months: 'Aylar',
  weeks: 'Haftalar',
  years: 'Yıllar',
  // viewSwitcherAriaLabel: 'Views',

  // DateNavigator
  closeSidePanel: 'Yan paneli kapat',
  openSidePanel: 'Yan paneli aç',

  // SidePanelDrawer (small screens)
  openMenu: 'Menüyü aç',

  // Preferences menu
  amPm12h: '12 saatlik (1:00 ÖS)',
  hour24h: '24 saatlik (13:00)',
  preferencesMenu: 'Tercihler',
  showWeekends: 'Hafta sonlarını göster',
  showEmptyDaysInAgenda: 'Boş günleri göster',
  showWeekNumber: 'Hafta numarasını göster',
  timeFormat: 'Saat biçimi',
  viewSpecificOptions: (view) => `${viewNames[view] ?? view} görünümü seçenekleri`,
  startWeekOn: 'Haftanın ilk günü',
  weekdaySunday: 'Pazar',
  weekdayMonday: 'Pazartesi',
  weekdaySaturday: 'Cumartesi',

  // WeekView
  allDay: 'Tüm gün',
  // dayGridLabel: 'All-day and multi-day events',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} tane daha`,
  nextTimeSpan: (timeSpan) => `Sonraki ${timeSpanNames[timeSpan] ?? timeSpan}`,
  previousTimeSpan: (timeSpan) => `Önceki ${timeSpanNames[timeSpan] ?? timeSpan}`,
  weekAbbreviation: 'H',
  weekNumberAriaLabel: (weekNumber) => `Hafta ${weekNumber}`,

  // AgendaView
  agendaViewEmptyStateLabel: 'Yaklaşan etkinlik yok',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Bitiş: ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Takvim',
  miniCalendarGoToPreviousMonth: 'Takvimde önceki ayı göster',
  miniCalendarGoToNextMonth: 'Takvimde sonraki ayı göster',

  // Main calendar region
  calendarContentAriaLabel: 'Takvim içeriği',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Kaynak adı',
};

const trTRTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Kaynak adı',

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

export const trTR: SchedulerLocalization = getSchedulerLocalization({
  dialog: trTRDialog,
  event: trTREvent,
  calendar: trTRCalendar,
  timeline: trTRTimeline,
});
