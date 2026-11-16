import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const colorNames: Record<string, string> = {
  red: 'merah',
  pink: 'merah muda',
  purple: 'ungu',
  indigo: 'nila',
  blue: 'biru',
  teal: 'hijau kebiruan',
  green: 'hijau',
  lime: 'hijau limau',
  amber: 'kuning amber',
  orange: 'oranye',
  grey: 'abu-abu',
};

const viewNames: Record<string, string> = {
  day: 'hari',
  week: 'minggu',
  month: 'bulan',
  agenda: 'agenda',
};

const timeSpanNames: Record<string, string> = {
  day: 'hari',
  week: 'minggu',
  month: 'bulan',
  agenda: 'periode',
};

const lagUnitNames: Record<string, string> = {
  minute: 'menit',
  hour: 'jam',
  day: 'hari',
  week: 'minggu',
};

const idIDDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Warna acara',
  colorSectionLabel: 'Warna',
  dateTimeSectionLabel: 'Tanggal & waktu',
  resourceColorSectionLabel: 'Sumber daya & warna',
  allDayLabel: 'Sepanjang hari',
  closeButtonAriaLabel: 'Tutup',
  closeButtonLabel: 'Tutup',
  editEventButtonAriaLabel: 'Edit acara',
  deleteEventButtonAriaLabel: 'Hapus acara',
  eventActionsToolbarAriaLabel: 'Tindakan acara',
  deleteEvent: 'Hapus acara',
  deleteConfirmationTitle: 'Hapus acara ini?',
  deleteConfirmationMessage:
    'Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?',
  cancel: 'Batal',
  editEvent: 'Edit acara',
  showEventDetails: 'Tampilkan detail',
  eventContextMenuAriaLabel: 'Tindakan acara',
  descriptionLabel: 'Deskripsi',
  endDateLabel: 'Tanggal selesai',
  endTimeLabel: 'Waktu selesai',
  eventTitleAriaLabel: 'Judul acara',
  generalTabLabel: 'Umum',
  labelNoResource: 'Tanpa sumber daya',
  labelInvalidResource: 'Sumber daya tidak valid',
  recurrenceLabel: 'Pengulangan',
  recurrenceNoRepeat: 'Jangan ulangi',
  recurrenceCustomRepeat: 'Aturan pengulangan khusus',
  recurrenceDailyPresetLabel: 'Berulang setiap hari',
  recurrenceDailyFrequencyLabel: 'hari',
  recurrenceEndsLabel: 'Berakhir',
  recurrenceEndsAfterLabel: 'Setelah',
  recurrenceEndsNeverLabel: 'Tidak pernah',
  recurrenceEndsUntilLabel: 'Hingga',
  recurrenceEndsTimesLabel: 'kali',
  recurrenceEveryLabel: 'Setiap',
  recurrenceRepeatLabel: 'Ulangi',
  recurrenceTabLabel: 'Pengulangan',
  recurrenceTimezoneLabel: (timezone) => `Zona waktu: ${timezone}`,
  recurrenceLabelTimezoneSuffix: (timezone) => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Pengulangan',
  recurrenceWeeklyFrequencyLabel: 'minggu',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) =>
    `Berulang setiap minggu pada hari ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'bulan',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Tanggal ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) =>
    `Hari ${weekdayName} terakhir dalam bulan`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} terakhir`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Berulang setiap bulan pada tanggal ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `Hari ${weekdayName} ke-${ord} dalam bulan`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName} ke-${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Pada',
  recurrenceYearlyFrequencyLabel: 'tahun',
  recurrenceYearlyPresetLabel: (date) => `Berulang setiap tahun pada ${date}`,
  noResourceAriaLabel: 'Tanpa sumber daya tertentu',
  selectColorAriaLabel: (color) => `Pilih ${colorNames[color] ?? color} sebagai warna acara`,
  resourceLabel: 'Sumber daya',
  invalidDateError: 'Masukkan tanggal yang valid.',
  invalidTimeError: 'Masukkan waktu yang valid.',
  requiredResourceError: 'Sumber daya wajib diisi.',
  saveChanges: 'Simpan',
  startDateAfterEndDateError: 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
  startDateLabel: 'Tanggal mulai',
  startTimeAfterEndTimeError: 'Waktu selesai harus setelah waktu mulai.',
  startTimeLabel: 'Waktu mulai',

  // RecurringScopeDialog
  all: 'Semua acara',
  confirm: 'Konfirmasi',
  onlyThis: 'Hanya acara ini',
  radioGroupAriaLabel: 'Cakupan pengeditan acara berulang',
  thisAndFollowing: 'Acara ini dan berikutnya',
  title: 'Terapkan perubahan ini ke:',

  // Errors
  somethingWentWrongError: 'Terjadi kesalahan. Coba lagi.',
  eventNotLoadedError:
    'Acara ini sedang disimpan, sehingga perubahan tidak diterapkan. Coba lagi setelah tersimpan.',
  eventChangedWhileConfirmingError:
    'Acara ini berubah saat konfirmasi penghapusan terbuka, sehingga penghapusan tidak diterapkan. Coba hapus lagi.',
  datesNotWritableError: 'Tanggal ini tidak dapat diubah, sehingga perubahan tidak diterapkan.',
  eventNotCreatableError:
    'Ini tidak dapat disimpan sebagai acara baru, sehingga perubahan tidak diterapkan.',
  readOnlyEventMovedError: (title) =>
    `Perubahan ini akan memindahkan acara baca-saja "${title}", sehingga tidak diterapkan.`,
  unwritableEventMovedError: (title) =>
    `Perubahan ini akan memindahkan acara "${title}" yang tanggalnya tidak dapat diubah, sehingga tidak diterapkan.`,
  dependencyCascadeBlockedError:
    'Dependensi ini akan memindahkan acara baca-saja, sehingga tidak dibuat.',
  dependencyDatesNotWritableError:
    'Dependensi ini akan memindahkan acara yang tanggalnya tidak dapat diubah, sehingga tidak dibuat.',
  dependencyCycleError: 'Dependensi ini akan membuat siklus antar-acara.',
  dependencyDuplicateError: 'Dependensi dengan jenis ini sudah ada di antara kedua acara ini.',
  dependencyRecurringEventError: 'Dependensi tidak dapat melibatkan acara berulang.',
  dependencyReadOnlyError: 'Dependensi tidak dapat diubah saat penjadwal dalam mode baca-saja.',
  dependencyUnknownEventError:
    'Dependensi ini tidak dapat dibuat karena salah satu acaranya sudah tidak ada.',
};

const idIDEvent: SchedulerEventTranslations = {
  // Event accessible name
  eventAriaLabelTimeRange: (start, end) => `${start} sampai ${end}`,
  eventAriaLabelDateRange: (start, end) => `Dari ${start} sampai ${end}`,
  eventAriaLabelAllDay: 'Sepanjang hari',
  eventAriaLabelRecurring: 'Berulang',
  resourceAriaLabel: (resourceName) => `Sumber daya: ${resourceName}`,
  eventAriaLabel: ({ title, when, date, resource, recurring }) =>
    [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const idIDCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Sumber daya',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Hari',
  month: 'Bulan',
  other: 'Lainnya',
  today: 'Hari ini',
  week: 'Minggu',
  time: 'Waktu',
  days: 'Hari',
  months: 'Bulan',
  weeks: 'Minggu',
  years: 'Tahun',
  viewSwitcherAriaLabel: 'Tampilan',

  // DateNavigator
  closeSidePanel: 'Tutup panel samping',
  openSidePanel: 'Buka panel samping',

  // SidePanelDrawer (small screens)
  openMenu: 'Buka menu',

  // Preferences menu
  amPm12h: '12 jam (1.00 PM)',
  hour24h: '24 jam (13.00)',
  preferencesMenu: 'Preferensi',
  showWeekends: 'Tampilkan akhir pekan',
  showEmptyDaysInAgenda: 'Tampilkan hari kosong',
  showWeekNumber: 'Tampilkan nomor minggu',
  timeFormat: 'Format waktu',
  viewSpecificOptions: (view) => `Opsi tampilan ${viewNames[view] ?? view}`,
  startWeekOn: 'Minggu dimulai pada',
  weekdaySunday: 'Minggu',
  weekdayMonday: 'Senin',
  weekdaySaturday: 'Sabtu',

  // WeekView
  allDay: 'Sepanjang hari',
  dayGridLabel: 'Acara sepanjang hari dan beberapa hari',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} lainnya..`,
  nextTimeSpan: (timeSpan) => `${timeSpanNames[timeSpan] ?? timeSpan} berikutnya`,
  previousTimeSpan: (timeSpan) => `${timeSpanNames[timeSpan] ?? timeSpan} sebelumnya`,
  weekAbbreviation: 'M',
  weekNumberAriaLabel: (weekNumber) => `Minggu ${weekNumber}`,

  // AgendaView
  agendaViewEmptyStateLabel: 'Tidak ada acara mendatang',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Berakhir ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Kalender',
  miniCalendarGoToPreviousMonth: 'Tampilkan bulan sebelumnya di kalender',
  miniCalendarGoToNextMonth: 'Tampilkan bulan berikutnya di kalender',

  // Main calendar region
  calendarContentAriaLabel: 'Konten kalender',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Nama sumber daya',
};

const idIDTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Nama sumber daya',

  // Dependency dialog
  dependencyEditTitle: 'Edit dependensi',
  dependencyDetailsTitle: 'Detail dependensi',
  dependencySourceLabel: 'Dari',
  dependencyTargetLabel: 'Ke',
  dependencyTypeLabel: 'Jenis',
  dependencyLagLabel: 'Jeda',
  dependencyLagUnitAriaLabel: 'Satuan jeda',
  dependencyNoLag: 'Tidak ada',
  dependencyInvalidLagError: 'Masukkan bilangan bulat, 0 atau lebih.',
  dependencyAllDayLagIgnored:
    'Acara sepanjang hari hanya dapat menunggu dalam hitungan hari penuh, sehingga jeda ini tidak menambah waktu tunggu.',
  dependencyAllDayLagRounded: (lag) =>
    `Acara sepanjang hari hanya dapat menunggu dalam hitungan hari penuh: ${lag}.`,
  dependencyUpdateCascadeBlockedError:
    'Perubahan ini akan memindahkan acara baca-saja, sehingga tidak diterapkan.',
  dependencyUpdateDatesNotWritableError:
    'Perubahan ini akan memindahkan acara yang tanggalnya tidak dapat diubah, sehingga tidak diterapkan.',
  dependencyUpdateNotFoundError: 'Dependensi ini sudah tidak ada.',
  dependencyTypeFinishToStart: 'Selesai ke mulai',
  dependencyTypeStartToStart: 'Mulai ke mulai',
  dependencyTypeFinishToFinish: 'Selesai ke selesai',
  dependencyTypeStartToFinish: 'Mulai ke selesai',
  dependencyLagUnitMinutes: 'menit',
  dependencyLagUnitHours: 'jam',
  dependencyLagUnitDays: 'hari',
  dependencyLagUnitWeeks: 'minggu',
  dependencyLag: (amount, unit) => `${amount} ${lagUnitNames[unit] ?? unit}`,

  // Dependency context menu and dialog actions
  dependencyActionsAriaLabel: 'Tindakan dependensi',
  editDependency: 'Edit dependensi',
  showDependencyDetails: 'Tampilkan detail',
  deleteDependency: 'Hapus',

  // Accessible description of an event that waits on dependencies
  dependencyFinishToStartDescription: ({ title, lag }) =>
    `Tidak dapat dimulai sampai ${lag === null ? '' : `${lag} setelah `}${title} selesai.`,
  dependencyStartToStartDescription: ({ title, lag }) =>
    `Tidak dapat dimulai sampai ${lag === null ? '' : `${lag} setelah `}${title} dimulai.`,
  dependencyFinishToFinishDescription: ({ title, lag }) =>
    `Tidak dapat selesai sampai ${lag === null ? '' : `${lag} setelah `}${title} selesai.`,
  dependencyStartToFinishDescription: ({ title, lag }) =>
    `Tidak dapat selesai sampai ${lag === null ? '' : `${lag} setelah `}${title} dimulai.`,
};

export const idID: SchedulerLocalization = getSchedulerLocalization({
  dialog: idIDDialog,
  event: idIDEvent,
  calendar: idIDCalendar,
  timeline: idIDTimeline,
});
