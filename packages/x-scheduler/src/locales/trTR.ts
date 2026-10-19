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
};

export const trTR: SchedulerLocalization = getSchedulerLocalization({
  dialog: trTRDialog,
  event: trTREvent,
  calendar: trTRCalendar,
  timeline: trTRTimeline,
});
