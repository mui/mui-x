import type { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import type { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'saat',
  minutes: 'dakika',
  seconds: 'saniye',
  meridiem: 'öğleden önce/sonra',
};

const trTRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Önceki ay',
  nextMonth: 'Sonraki ay',

  // View navigation
  openPreviousView: 'Önceki görünüm',
  openNextView: 'Sonraki görünüm',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'yıl görünümü açık, takvim görünümüne geç'
      : 'takvim görünümü açık, yıl görünümüne geç',

  // DateRange labels
  start: 'Başlangıç',
  end: 'Bitiş',
  startDate: 'Başlangıç tarihi',
  startTime: 'Başlangıç saati',
  endDate: 'Bitiş tarihi',
  endTime: 'Bitiş saati',

  // Action bar
  cancelButtonLabel: 'İptal',
  clearButtonLabel: 'Temizle',
  okButtonLabel: 'Tamam',
  todayButtonLabel: 'Bugün',
  nextStepButtonLabel: 'Sonraki',

  // Toolbar titles
  datePickerToolbarTitle: 'Tarih Seç',
  dateTimePickerToolbarTitle: 'Tarih & Saat seç',
  timePickerToolbarTitle: 'Saat seç',
  dateRangePickerToolbarTitle: 'Tarih aralığı seçin',
  timeRangePickerToolbarTitle: 'Saat aralığı seçin',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view]} seç.  ${!formattedTime ? 'Zaman seçilmedi' : `Seçilen zaman: ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} saat`,
  minutesClockNumberText: (minutes) => `${minutes} dakika`,
  secondsClockNumberText: (seconds) => `${seconds} saniye`,

  // Digital clock labels
  selectViewText: (view) => `${timeViews[view]} seç`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Hafta numarası',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Hafta ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Tarih seçin, seçilen tarih: ${formattedDate}` : 'Tarih seç',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Saat seçin, seçilen saat: ${formattedTime}` : 'Saat seç',
  openRangePickerDialogue: (formattedRange) =>
    formattedRange ? `Aralık seçin, seçilen aralık: ${formattedRange}` : 'Aralık seç',
  fieldClearLabel: 'Temizle',

  // Table labels
  timeTableLabel: 'saat seç',
  dateTableLabel: 'tarih seç',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'AAA' : 'AA'),
  fieldDayPlaceholder: () => 'GG',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'HHH' : 'HH'),
  fieldHoursPlaceholder: () => 'ss',
  fieldMinutesPlaceholder: () => 'dd',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Yıl',
  month: 'Ay',
  day: 'Gün',
  weekDay: 'Haftanın günü',
  hours: 'Saat',
  minutes: 'Dakika',
  seconds: 'Saniye',
  meridiem: 'Öğleden önce/sonra',

  // Common
  empty: 'Boş',
};

export const trTR = getPickersLocalization(trTRPickers);
