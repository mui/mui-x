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

  throw new Error(`getDatePartNameFromFormat don't understand the format ${format}`);
};

export const incrementDatePart = <TDate>(
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
    if (i === value.length - 1) {
      temp.push({
        start: i - currentSectionValue.length,
        value: `${currentSectionValue}${char}`,
      });
    } else if (['/', ' '].includes(char)) {
      temp.push({ start: i - currentSectionValue.length, value: currentSectionValue });
      currentSectionValue = '';
    } else {
      currentSectionValue = `${currentSectionValue}${char}`;
    }
  }

  return temp;
};

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
