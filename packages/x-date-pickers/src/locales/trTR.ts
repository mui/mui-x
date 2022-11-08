import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const trTRPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Önceki ay',
  nextMonth: 'Sonraki ay',

  // View navigation
  openPreviousView: 'sonraki görünüm',
  openNextView: 'önceki görünüm',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'yıl görünümü açık, takvim görünümüne geç'
      : 'takvim görünümü açık, yıl görünümüne geç',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
    isKeyboardInputOpen
      ? `metin girişi görünümü açık, şuraya gidin: ${viewType} görünümü`
      : `${viewType} görünüm açık, metin girişi görünümüne gidin`,

  // DateRange placeholders
  start: 'Başlangıç',
  end: 'Bitiş',

  // Action bar
  cancelButtonLabel: 'iptal',
  clearButtonLabel: 'Temizle',
  okButtonLabel: 'Tamam',
  todayButtonLabel: 'Bugün',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Tarih Seç',
  dateTimePickerDefaultToolbarTitle: 'Tarih & Saat seç',
  timePickerDefaultToolbarTitle: 'Saat seç',
  dateRangePickerDefaultToolbarTitle: 'Tarih aralığı seçin',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${view} seç.  ${
      time === null ? 'Zaman seçilmedi' : `Seçilen zaman: ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} saat`,
  minutesClockNumberText: (minutes) => `${minutes} dakika`,
  secondsClockNumberText: (seconds) => `${seconds} saniye`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Tarih seçin, seçilen tarih: ${utils.format(value, 'fullDate')}`
      : 'Tarih seç',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Saat seçin, seçilen saat: ${utils.format(value, 'fullTime')}`
      : 'Saat seç',

  // Table labels
  timeTableLabel: 'saat seç',
  dateTableLabel: 'tarih seç',
};

export const trTR = getPickersLocalization(trTRPickers);
