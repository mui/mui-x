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

  if (['hh'].includes(format)) {
    return 'hour';
  }

  if (['mm'].includes(format)) {
    return 'minute';
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
    default: {
      return date;
    }
  }
};

const addStartPropertyToSections = (sections: Omit<DateFieldInputSection, 'start'>[]) => {
  let position = 0;
  const newSections: DateFieldInputSection[] = [];

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    newSections.push({ ...section, start: position });
    position += section.value.length + (section.separator?.length ?? 0);
  }

  return newSections;
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
        const dateForCurrentToken = utils.formatByString(date, currentTokenValue);
        if (dateForCurrentToken === currentTokenValue) {
          sections[sections.length - 1].separator += currentTokenValue;
          currentTokenValue = '';
        } else {
          sections.push({
            formatValue: currentTokenValue,
            value: dateForCurrentToken,
            dateSectionName: getDateSectionNameFromFormat(currentTokenValue),
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
      const dateForCurrentToken = utils.formatByString(date, currentTokenValue);
      if (dateForCurrentToken === currentTokenValue) {
        sections[sections.length - 1].separator += currentTokenValue;
      } else {
        sections.push({
          formatValue: currentTokenValue,
          value: dateForCurrentToken,
          dateSectionName: getDateSectionNameFromFormat(currentTokenValue),
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
    .map((section) =>
      section.separator == null ? section.value : `${section.value}${section.separator}`,
    )
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

export const updateSectionValue = (
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
