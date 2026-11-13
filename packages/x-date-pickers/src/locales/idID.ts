import type { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import type { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'jam',
  minutes: 'menit',
  seconds: 'detik',
  meridiem: 'AM/PM',
};

const idIDPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Bulan sebelumnya',
  nextMonth: 'Bulan berikutnya',

  // View navigation
  openPreviousView: 'Buka tampilan sebelumnya',
  openNextView: 'Buka tampilan berikutnya',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'tampilan tahun terbuka, beralih ke tampilan kalender'
      : 'tampilan kalender terbuka, beralih ke tampilan tahun',

  // DateRange labels
  start: 'Mulai',
  end: 'Selesai',
  startDate: 'Tanggal mulai',
  startTime: 'Waktu mulai',
  endDate: 'Tanggal selesai',
  endTime: 'Waktu selesai',

  // Action bar
  cancelButtonLabel: 'Batal',
  clearButtonLabel: 'Hapus',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hari ini',
  nextStepButtonLabel: 'Berikutnya',

  // Toolbar titles
  datePickerToolbarTitle: 'Pilih tanggal',
  dateTimePickerToolbarTitle: 'Pilih tanggal & waktu',
  timePickerToolbarTitle: 'Pilih waktu',
  dateRangePickerToolbarTitle: 'Pilih rentang tanggal',
  timeRangePickerToolbarTitle: 'Pilih rentang waktu',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Pilih ${timeViews[view]}. ${!formattedTime ? 'Belum ada waktu yang dipilih' : `Waktu yang dipilih adalah ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} jam`,
  minutesClockNumberText: (minutes) => `${minutes} menit`,
  secondsClockNumberText: (seconds) => `${seconds} detik`,

  // Digital clock labels
  selectViewText: (view) => `Pilih ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Nomor minggu',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Minggu ke-${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Pilih tanggal, tanggal yang dipilih adalah ${formattedDate}` : 'Pilih tanggal',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Pilih waktu, waktu yang dipilih adalah ${formattedTime}` : 'Pilih waktu',
  openRangePickerDialogue: (formattedRange) =>
    formattedRange
      ? `Pilih rentang, rentang yang dipilih adalah ${formattedRange}`
      : 'Pilih rentang',
  fieldClearLabel: 'Hapus',

  // Table labels
  timeTableLabel: 'pilih waktu',
  dateTableLabel: 'pilih tanggal',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'T'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'BBBB' : 'BB'),
  fieldDayPlaceholder: () => 'HH',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'jj',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'dd',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Tahun',
  month: 'Bulan',
  day: 'Hari',
  weekDay: 'Hari dalam minggu',
  hours: 'Jam',
  minutes: 'Menit',
  seconds: 'Detik',
  meridiem: 'AM/PM',

  // Common
  empty: 'Kosong',
};

export const idID = getPickersLocalization(idIDPickers);
