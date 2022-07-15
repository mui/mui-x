import * as React from 'react';
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

export const splitFormatIntoSections = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  format: string,
  date: TDate,
) => {
  let currentTokenValue = '';
  const temp: DateFieldInputSection[] = [];

  for (let i = 0; i < format.length; i += 1) {
    const char = format[i];
    if (!char.match(/([A-zÀ-ú]+)/g)) {
      if (currentTokenValue === '') {
        temp[temp.length - 1].separator += char;
      } else {
        const dateForCurrentToken = utils.formatByString(date, currentTokenValue);
        if (dateForCurrentToken === currentTokenValue) {
          temp[temp.length - 1].separator += currentTokenValue;
          currentTokenValue = '';
        } else {
          temp.push({
            start: i - currentTokenValue.length,
            formatValue: currentTokenValue,
            value: dateForCurrentToken,
            dateSectionName: getDateSectionNameFromFormat(currentTokenValue),
            separator: char,
          });
          currentTokenValue = '';
        }
      }
    } else {
      currentTokenValue += char;
    }

    if (i === format.length - 1) {
      const previousSection = temp[temp.length - 1];

      const start = previousSection
        ? previousSection.start +
          previousSection.value.length +
          (previousSection.separator?.length ?? 0)
        : 0;

      const dateForCurrentToken = utils.formatByString(date, currentTokenValue);
      if (dateForCurrentToken === currentTokenValue) {
        temp[temp.length - 1].separator += currentTokenValue;
      } else {
        temp.push({
          start,
          formatValue: currentTokenValue,
          value: dateForCurrentToken,
          dateSectionName: getDateSectionNameFromFormat(currentTokenValue),
          separator: null,
        });
      }
    }
  }

  return temp;
};

export const createDateStrFromSections = (sections: DateFieldInputSection[]) =>
  sections
    .map((section) =>
      section.separator == null ? section.value : `${section.value}${section.separator}`,
    )
    .join('');

export const getInputSectionIndexFromCursorPosition = (
  sections: DateFieldInputSection[],
  position: number,
) => {
  const nextSectionIndex = sections.findIndex((section) => section.start > position);

  if (nextSectionIndex === -1) {
    return sections.length - 1;
  }

  return nextSectionIndex - 1;
};

export const focusInputSection = (
  inputRef: React.RefObject<HTMLInputElement>,
  section: DateFieldInputSection,
) => {
  inputRef.current!.setSelectionRange(section.start, section.start + section.value.length);
};

export const updateSectionValue = (
  sections: DateFieldInputSection[],
  currentSectionIndex: number,
  newSectionValue: string,
) =>
  sections.map((section, index) => {
    if (index === currentSectionIndex) {
      return {
        ...section,
        value: newSectionValue,
      };
    }

    return section;
  });
