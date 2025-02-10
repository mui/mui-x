import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'saat',
  minutes: 'dakika',
  seconds: 'saniye',
  meridiem: 'öğleden sonra',
};

const trTRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Önceki ay',
  nextMonth: 'Sonraki ay',

  // View navigation
  openPreviousView: 'Sonraki görünüm',
  openNextView: 'Önceki görünüm',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'yıl görünümü açık, takvim görünümüne geç'
      : 'takvim görünümü açık, yıl görünümüne geç',

  // DateRange labels
  start: 'Başlangıç',
  end: 'Bitiş',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'iptal',
  clearButtonLabel: 'Temizle',
  okButtonLabel: 'Tamam',
  todayButtonLabel: 'Bugün',

  // Toolbar titles
  datePickerToolbarTitle: 'Tarih Seç',
  dateTimePickerToolbarTitle: 'Tarih & Saat seç',
  timePickerToolbarTitle: 'Saat seç',
  dateRangePickerToolbarTitle: 'Tarih aralığı seçin',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view]} seç.  ${!formattedTime ? 'Zaman seçilmedi' : `Seçilen zaman: ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} saat`,
  minutesClockNumberText: (minutes) => `${minutes} dakika`,
  secondsClockNumberText: (seconds) => `${seconds} saniye`,

  // Digital clock labels
  selectViewText: (view) => `Seç ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Hafta numarası',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Hafta ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Tarih seçin, seçilen tarih: ${formattedDate}` : 'Tarih seç',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Saat seçin, seçilen saat: ${formattedTime}` : 'Saat seç',
  // fieldClearLabel: 'Clear',

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
  // year: 'Year',
  // month: 'Month',
  // day: 'Day',
  // weekDay: 'Week day',
  // hours: 'Hours',
  // minutes: 'Minutes',
  // seconds: 'Seconds',
  // meridiem: 'Meridiem',

  // Common
  // empty: 'Empty',
};

export const trTR = getPickersLocalization(trTRPickers);
