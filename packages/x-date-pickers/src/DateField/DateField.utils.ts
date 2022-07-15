import * as React from 'react';
import { DateFieldInputSection, DateSectionName } from './DateField.interfaces';
import { MuiPickersAdapter } from '../internals/models/muiPickersAdapter';

export const SECTION_SEPARATOR_KEYS = ['/', ' '];

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

export const splitStringIntoSections = (value: string) => {
  let currentSectionValue = '';
  const temp: Omit<DateFieldInputSection, 'dateSectionName'>[] = [];

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (SECTION_SEPARATOR_KEYS.includes(char)) {
      temp.push({
        start: i - currentSectionValue.length,
        value: currentSectionValue,
        separator: char,
      });
      currentSectionValue = '';
    } else {
      currentSectionValue = `${currentSectionValue}${char}`;
    }

    if (i === value.length - 1) {
      const previousSection = temp[temp.length - 1];
      temp.push({
        start:
          previousSection.start +
          previousSection.value.length +
          (previousSection.separator?.length ?? 0),
        value: currentSectionValue,
        separator: null,
      });
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
