import { AdapterFormats } from './models';

/**
 * Base adapter formats shared between Dayjs and Moment adapters.
 * Only `weekdayShort` differs between them.
 */
export const BASE_ADAPTER_FORMATS: Omit<AdapterFormats, 'weekdayShort'> = {
  year: 'YYYY',
  month: 'MMMM',
  monthShort: 'MMM',
  dayOfMonth: 'D',
  dayOfMonthFull: 'Do',
  weekday: 'dddd',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'A',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'll',
  keyboardDate: 'L',
  shortDate: 'MMM D',
  normalDate: 'D MMMM',
  normalDateWithWeekday: 'ddd, MMM D',

  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',

  keyboardDateTime12h: 'L hh:mm A',
  keyboardDateTime24h: 'L HH:mm',
};
