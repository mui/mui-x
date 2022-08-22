import defaultLocale from 'date-fns/locale/en-US';
// @ts-ignore
import longFormatters from 'date-fns/_lib/format/longFormatters';
import { FieldSection, DateSectionName } from './useField.interfaces';
import { MuiPickersAdapter } from '../../models';

// TODO: Improve and test with different calendars (move to date-io ?)
export const getDateSectionNameFromFormat = (format: string): DateSectionName => {
  if (['MMMM', 'MM'].includes(format)) {
    return 'month';
  }

  if (['y', 'yy', 'yyy', 'yyyy'].includes(format)) {
    return 'year';
  }

  if (['dd'].includes(format)) {
    return 'day';
  }

  if (['h', 'H', 'hh', 'HH'].includes(format)) {
    return 'hour';
  }

  if (['mm'].includes(format)) {
    return 'minute';
  }

  if (['ss'].includes(format)) {
    return 'second';
  }

  if (['a', 'aa', 'aaa'].includes(format)) {
    return 'am-pm';
  }

  throw new Error(`getDatePartNameFromFormat don't understand the format ${format}`);
};

export const incrementDateSectionValue = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  datePartName: DateSectionName,
  datePartValue: 1 | -1,
) => {
  switch (datePartName) {
    case 'day': {
      return utils.addDays(date, datePartValue);
    }
    case 'month': {
      return utils.addMonths(date, datePartValue);
    }
    case 'year': {
      return utils.addYears(date, datePartValue);
    }
    case 'am-pm': {
      return utils.addHours(date, datePartValue * 12);
    }
    case 'hour': {
      return utils.addHours(date, datePartValue);
    }
    case 'minute': {
      return utils.addMinutes(date, datePartValue);
    }
    case 'second': {
      return utils.addSeconds(date, datePartValue);
    }
    default: {
      return date;
    }
  }
};

export const getSectionVisibleValue = (section: Omit<FieldSection, 'start' | 'end'>) =>
  section.value || section.emptyValue;

export const addPositionPropertiesToSections = <TSection extends FieldSection>(
  sections: Omit<TSection, 'start' | 'end'>[],
): TSection[] => {
  let position = 0;
  const newSections: TSection[] = [];

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const end =
      position + getSectionVisibleValue(section).length + (section.separator?.length ?? 0);

    newSections.push({ ...section, start: position, end } as TSection);
    position = end;
  }

  return newSections;
};

const formatDateWithPlaceholder = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate | null,
  format: string,
) => {
  if (date == null) {
    return '';
  }

  return utils.formatByString(date, format);
};

export const splitFormatIntoSections = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  format: string,
  date: TDate | null,
) => {
  let currentTokenValue = '';
  const sections: Omit<FieldSection, 'start' | 'end'>[] = [];

  // Copy pasted from the `getFormatHelperText` in the date-fns adapter
  // Would need to be turned into an adapter method
  const longFormatRegexp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  const locale = utils.locale || defaultLocale;
  const cleanFormat = format
    .match(longFormatRegexp)!
    .map((token) => {
      const firstCharacter = token[0];
      if (firstCharacter === 'p' || firstCharacter === 'P') {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(token, locale.formatLong, {});
      }
      return token;
    })
    .join('');

  for (let i = 0; i < cleanFormat.length; i += 1) {
    const char = cleanFormat[i];
    if (!char.match(/([A-zÀ-ú]+)/g)) {
      if (currentTokenValue === '') {
        sections[sections.length - 1].separator += char;
      } else {
        const dateForCurrentToken = formatDateWithPlaceholder(utils, date, currentTokenValue);
        if (dateForCurrentToken === currentTokenValue) {
          sections[sections.length - 1].separator += currentTokenValue;
          currentTokenValue = '';
        } else {
          const dateSectionName = getDateSectionNameFromFormat(currentTokenValue);

          sections.push({
            formatValue: currentTokenValue,
            value: dateForCurrentToken,
            emptyValue: dateSectionName,
            dateSectionName,
            separator: char,
            query: null,
          });
          currentTokenValue = '';
        }
      }
    } else {
      currentTokenValue += char;
    }

    if (i === cleanFormat.length - 1) {
      const dateForCurrentToken = formatDateWithPlaceholder(utils, date, currentTokenValue);
      if (dateForCurrentToken === currentTokenValue) {
        sections[sections.length - 1].separator += currentTokenValue;
      } else {
        const dateSectionName = getDateSectionNameFromFormat(currentTokenValue);

        sections.push({
          formatValue: currentTokenValue,
          value: dateForCurrentToken,
          emptyValue: dateSectionName,
          dateSectionName,
          separator: null,
          query: null,
        });
      }
    }
  }

  return sections;
};

export const createDateStrFromSections = (sections: FieldSection[]) =>
  sections
    .map((section) => {
      let sectionValueStr = getSectionVisibleValue(section);

      if (section.separator != null) {
        sectionValueStr += section.separator;
      }

      return sectionValueStr;
    })
    .join('');

export const setSectionValue = <TSection extends FieldSection>(
  sections: TSection[],
  sectionIndex: number,
  sectionNewValue: string,
  sectionNewQuery?: string | null,
) => {
  const newSections = [...sections];
  const modifiedSection = { ...newSections[sectionIndex], value: sectionNewValue };
  if (sectionNewQuery !== undefined) {
    modifiedSection.query = sectionNewQuery;
  }

  newSections[sectionIndex] = modifiedSection;

  return addPositionPropertiesToSections<TSection>(newSections);
};

export const getMonthsMatchingQuery = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  format: string,
  query: string,
) => {
  const monthList = utils
    .getMonthArray(utils.date()!)
    .map((month) => utils.formatByString(month, format));
  return monthList.filter((month) => month.toLowerCase().startsWith(query));
};

export const getSectionValueNumericBoundaries = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  dateSectionName: DateSectionName,
) => {
  const dateWithFallback = utils.isValid(date) ? date : utils.date()!;
  const endOfYear = utils.endOfYear(dateWithFallback);

  switch (dateSectionName) {
    case 'day':
      return {
        minimum: 1,
        maximum: utils.getDaysInMonth(dateWithFallback),
      };

    case 'month': {
      return {
        minimum: 1,
        maximum: utils.getMonth(endOfYear) + 1,
      };
    }

    case 'year':
      return {
        minimum: 1,
        maximum: 9999,
      };

    case 'hour': {
      return {
        minimum: 0,
        maximum: utils.getHours(endOfYear),
      };
    }

    case 'minute': {
      return {
        minimum: 0,
        maximum: utils.getMinutes(endOfYear),
      };
    }

    case 'second': {
      return {
        minimum: 0,
        maximum: utils.getSeconds(endOfYear),
      };
    }

    default: {
      return {
        minimum: 0,
        maximum: 0,
      };
    }
  }
};

export const incrementOrDecrementInvalidDateSection = <TDate, TSection extends FieldSection>(
  utils: MuiPickersAdapter<TDate>,
  section: TSection,
  type: 'increment' | 'decrement',
) => {
  const today = utils.date()!;
  const delta = type === 'increment' ? 1 : -1;

  switch (section.dateSectionName) {
    case 'year': {
      if (section.value === '') {
        return utils.formatByString(today, section.formatValue);
      }

      return utils.formatByString(
        utils.setYear(today, Number(section.value) + delta),
        section.formatValue,
      );
    }

    case 'month': {
      let newDate: TDate;
      if (section.value === '') {
        if (type === 'increment') {
          newDate = utils.endOfYear(today);
        } else {
          newDate = utils.startOfYear(today);
        }
      } else {
        newDate = utils.addMonths(utils.parse(section.value, section.formatValue)!, delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'day': {
      let newDate: TDate;
      if (section.value === '') {
        if (type === 'increment') {
          newDate = utils.endOfMonth(today);
        } else {
          newDate = utils.startOfMonth(today);
        }
      } else {
        newDate = utils.addDays(utils.parse(section.value, section.formatValue)!, delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'am-pm': {
      const am = utils.formatByString(utils.startOfDay(today), section.formatValue);
      const pm = utils.formatByString(utils.endOfDay(today), section.formatValue);

      if (section.value === '') {
        if (type === 'increment') {
          return pm;
        }
        return am;
      }

      if (section.value === am) {
        return pm;
      }

      return am;
    }

    case 'hour': {
      let newDate: TDate;
      if (section.value === '') {
        if (type === 'increment') {
          newDate = utils.endOfDay(today);
        } else {
          newDate = utils.startOfDay(today);
        }
      } else {
        newDate = utils.addHours(utils.setHours(today, Number(section.value)), delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'minute': {
      let newDate: TDate;
      if (section.value === '') {
        // TODO: Add startOfHour and endOfHours to adapters to avoid hard-coding those values
        const newNumericValue = type === 'increment' ? 59 : 0;
        newDate = utils.setMinutes(today, newNumericValue);
      } else {
        newDate = utils.addMinutes(utils.setMinutes(today, Number(section.value)), delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'second': {
      let newDate: TDate;
      if (section.value === '') {
        // TODO: Add startOfMinute and endOfMinute to adapters to avoid hard-coding those values
        const newNumericValue = type === 'increment' ? 59 : 0;
        newDate = utils.setSeconds(today, newNumericValue);
      } else {
        newDate = utils.addSeconds(utils.setSeconds(today, Number(section.value)), delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    default: {
      throw new Error(`Invalid date section name`);
    }
  }
};

export const cleanTrailingZeroInNumericSectionValue = (value: string, maximum: number) => {
  const maximumStr = maximum.toString();
  let cleanValue = value;

  // We remove the trailing zeros
  cleanValue = Number(cleanValue).toString();

  // We add enough trailing zeros to fill the section
  while (cleanValue.length < maximumStr.length) {
    cleanValue = `0${cleanValue}`;
  }

  return cleanValue;
};
