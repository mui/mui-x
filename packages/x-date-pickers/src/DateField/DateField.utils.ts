import { DateFieldInputSection, DateSectionName } from './DateField.interfaces';
import { MuiPickersAdapter } from '../internals/models/muiPickersAdapter';

// TODO: Improve and test with different calendars (move to date-io ?)
export const getDateSectionNameFromFormat = (format: string): DateSectionName => {
  if (['MMMM', 'MM'].includes(format)) {
    return 'month';
  }

  if (['yyyy'].includes(format)) {
    return 'year';
  }

  if (['dd'].includes(format)) {
    return 'day';
  }

  if (['hh', 'HH'].includes(format)) {
    return 'hour';
  }

  if (['mm'].includes(format)) {
    return 'minute';
  }

  if (['ss'].includes(format)) {
    return 'second';
  }

  if (['aa'].includes(format)) {
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
      throw new Error('addYear is not supported by date-io');
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

export const getSectionVisibleValue = (section: Omit<DateFieldInputSection, 'start'>) =>
  section.value || section.emptyValue;

const addStartPropertyToSections = (sections: Omit<DateFieldInputSection, 'start'>[]) => {
  let position = 0;
  const newSections: DateFieldInputSection[] = [];

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    newSections.push({ ...section, start: position });

    position += getSectionVisibleValue(section).length + (section.separator?.length ?? 0);
  }

  return newSections;
};

export const formatDateWithPlaceholder = <TDate>(
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
  date: TDate,
) => {
  let currentTokenValue = '';
  const sections: Omit<DateFieldInputSection, 'start'>[] = [];

  for (let i = 0; i < format.length; i += 1) {
    const char = format[i];
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

    if (i === format.length - 1) {
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

  return addStartPropertyToSections(sections);
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

export const getSectionIndexFromCursorPosition = (
  sections: DateFieldInputSection[],
  position: number | null,
) => {
  const nextSectionIndex = sections.findIndex((section) => section.start > (position ?? 0));

  if (nextSectionIndex === -1) {
    return sections.length - 1;
  }

  return nextSectionIndex - 1;
};

export const setSectionValue = (
  sections: DateFieldInputSection[],
  currentSectionIndex: number,
  newSectionValue: string,
  newSectionQuery: string | null = null,
) => {
  const newSections = sections.map((section, index) => {
    if (index === currentSectionIndex) {
      return {
        ...section,
        value: newSectionValue,
        query: newSectionQuery,
      };
    }

    return section;
  });

  return addStartPropertyToSections(newSections);
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
    minimum: 0,
    maximum,
  };
};
