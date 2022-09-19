import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const isISPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Fyrri mánuður',
  nextMonth: 'Næsti mánuður',

  // View navigation
  openPreviousView: 'opna fyrri skoðun',
  openNextView: 'opna næstu skoðun',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'ársskoðun er opin, skipta yfir í dagatalsskoðun'
      : 'dagatalsskoðun er opin, skipta yfir í ársskoðun',
  inputModeToggleButtonAriaLabel: (
    isKeyboardInputOpen: boolean,
    viewType: 'calendar' | 'clock',
  ) => {
    const viewTypeTranslated = viewType === 'calendar' ? 'dagatals' : 'klukku';
    return isKeyboardInputOpen
      ? `textainnsláttur er opinn, fara í ${viewTypeTranslated}skoðun`
      : `${viewTypeTranslated}skoðun er opin, opna fyrir textainnslátt`;
  },

  // DateRange placeholders
  start: 'Upphaf',
  end: 'Endir',

  // Action bar
  cancelButtonLabel: 'Hætta við',
  clearButtonLabel: 'Hreinsa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Í dag',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Velja dagsetningu',
  dateTimePickerDefaultToolbarTitle: 'Velja dagsetningu og tíma',
  timePickerDefaultToolbarTitle: 'Velja tíma',
  dateRangePickerDefaultToolbarTitle: 'Velja tímabil',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Enginn tími valinn' : `Valinn tími er ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} klukkustundir`,
  minutesClockNumberText: (minutes) => `${minutes} mínútur`,
  secondsClockNumberText: (seconds) => `${seconds} sekúndur`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velja dagsetningu, valin dagsetning er ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Velja dagsetningu',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velja tíma, valinn tími er ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Velja tíma',

  // Table labels
  timeTableLabel: 'velja tíma',
  dateTableLabel: 'velja dagsetningu',
};

export const isIS = getPickersLocalization(isISPickers);
