import defaultLocale from 'date-fns/locale/en-US';
// @ts-ignore
import longFormatters from 'date-fns/_lib/format/longFormatters';
import { DateFieldInputSection, DateSectionName } from './DateField.interfaces';
import { MuiPickersAdapter } from '../internals/models/muiPickersAdapter';

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

export const incrementDatePartValue = <TDate>(
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

export const getSectionVisibleValue = (section: Omit<DateFieldInputSection, 'start' | 'end'>) =>
  section.value || section.emptyValue;

export const addPositionPropertiesToSections = <TSection extends DateFieldInputSection>(
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
  const sections: Omit<DateFieldInputSection, 'start' | 'end'>[] = [];

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

export const createDateStrFromSections = (sections: DateFieldInputSection[]) =>
  sections
    .map((section) => {
      let sectionValueStr = getSectionVisibleValue(section);

      if (section.separator != null) {
        sectionValueStr += section.separator;
      }

      return sectionValueStr;
    })
    .join('');

export const setSectionValue = <TSection extends DateFieldInputSection>(
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

export const getMonthList = <TDate>(utils: MuiPickersAdapter<TDate>, format: string) =>
  utils.getMonthArray(utils.date()!).map((month) => utils.formatByString(month, format));

export const getMonthsMatchingQuery = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  format: string,
  query: string,
) => getMonthList(utils, format).filter((month) => month.toLowerCase().startsWith(query));

export const getSectionValueNumericBoundaries = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  dateSectionName: DateSectionName,
) => {
  let maximum: number;
  switch (dateSectionName) {
    case 'day':
      maximum = utils.getDaysInMonth(date);
      break;

    case 'month': {
      maximum = utils.getMonthArray(date).length;
      break;
    }

    case 'year':
      // TODO: Make generic
      maximum = 9999;
      break;

    default: {
      maximum = 0;
    }
  }

  return {
    // TODO: Make generic
    minimum: 1,
    maximum,
  };
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
