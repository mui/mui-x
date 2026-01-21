/* v8 ignore start */
import dayjs, { Dayjs } from 'dayjs';
// dayjs has no exports field defined
// See https://github.com/iamkun/dayjs/issues/2562
/* eslint-disable import/extensions */
import buddhistEraPlugin from 'dayjs/plugin/buddhistEra.js';
/* v8 ignore stop */
/* eslint-enable import/extensions */
import { AdapterDayjs } from '../AdapterDayjs';
import { FieldFormatTokenMap, AdapterFormats, AdapterOptions } from '../models';

dayjs.extend(buddhistEraPlugin);

// Buddhist Era offset
const BUDDHIST_YEAR_OFFSET = 543;

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  YY: 'year',
  YYYY: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
  // Buddhist Era year
  BB: 'year',
  BBBB: { sectionType: 'year', contentType: 'digit', maxLength: 4 },

  // Month
  M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  D: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  DD: 'day',
  Do: { sectionType: 'day', contentType: 'digit-with-letter' },

  // Day of the week
  d: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
  dd: { sectionType: 'weekDay', contentType: 'letter' },
  ddd: { sectionType: 'weekDay', contentType: 'letter' },
  dddd: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  HH: 'hours',
  h: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  hh: 'hours',

  // Minutes
  m: { sectionType: 'minutes', contentType: 'digit', maxLength: 2 },
  mm: 'minutes',

  // Seconds
  s: { sectionType: 'seconds', contentType: 'digit', maxLength: 2 },
  ss: 'seconds',
};

const defaultFormats: AdapterFormats = {
  year: 'BBBB',
  month: 'MMMM',
  monthShort: 'MMM',
  dayOfMonth: 'D',
  dayOfMonthFull: 'Do',
  weekday: 'dddd',
  weekdayShort: 'dd',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'A',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'D MMM BBBB',
  keyboardDate: 'DD/MM/BBBB',
  shortDate: 'D MMM',
  normalDate: 'D MMMM',
  normalDateWithWeekday: 'ddd, D MMM',

  fullTime12h: 'hh:mm A',
  fullTime24h: 'HH:mm',

  keyboardDateTime12h: 'DD/MM/BBBB hh:mm A',
  keyboardDateTime24h: 'DD/MM/BBBB HH:mm',
};

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    'dayjs-buddhist': Dayjs;
  }
}

/**
 * Adapter for dayjs with Buddhist Era calendar support.
 * Buddhist Era is used in Thailand and other Southeast Asian countries.
 * It uses the same months and days as the Gregorian calendar but with a year offset of 543.
 */
export class AdapterDayjsBuddhist extends AdapterDayjs {
  constructor({ locale, formats }: AdapterOptions<string, never> = {}) {
    super({ locale, formats: { ...defaultFormats, ...formats } });
    this.lib = 'dayjs-buddhist';
    this.formatTokenMap = formatTokenMap;
  }

  /**
   * Returns the Buddhist year (Gregorian year + 543)
   */
  public getYear = (value: Dayjs) => {
    return value.year() + BUDDHIST_YEAR_OFFSET;
  };

  /**
   * Sets the Buddhist year (converts to Gregorian year internally)
   */
  public setYear = (value: Dayjs, year: number) => {
    return this.adjustOffset(value.set('year', year - BUDDHIST_YEAR_OFFSET));
  };

  /**
   * Parses a date string with Buddhist year support.
   * The buddhistEra plugin only supports formatting, not parsing,
   * so we convert BBBB/BB to YYYY/YY and adjust the year after parsing.
   */
  public parse = (value: string, format: string) => {
    if (value === '') {
      return null;
    }

    // Check if format contains Buddhist year tokens
    const hasBuddhistYear = /BBBB|BB/.test(format);

    // dayjs can't parse BBBB/BB tokens, replace with YYYY/YY
    const parseFormat = hasBuddhistYear
      ? format.replace(/BBBB/g, 'YYYY').replace(/BB/g, 'YY')
      : format;

    const parsed = dayjs(value, parseFormat, this.locale, true);

    if (!parsed.isValid() || !hasBuddhistYear) {
      return parsed;
    }

    // Convert Buddhist year input to Gregorian
    return parsed.subtract(BUDDHIST_YEAR_OFFSET, 'year');
  };
}
