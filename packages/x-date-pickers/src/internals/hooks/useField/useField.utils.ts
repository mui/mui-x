import {
  FieldSection,
  AvailableAdjustKeyCode,
  FieldSectionsValueBoundaries,
  SectionNeighbors,
  SectionOrdering,
  FieldValueType,
} from './useField.types';
import { MuiPickersAdapter, MuiDateSectionName } from '../../models';
import { PickersLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export const getDateSectionConfigFromFormatToken = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  formatToken: string,
): Pick<FieldSection, 'dateSectionName' | 'contentType'> => {
  const config = utils.formatTokenMap[formatToken];

  if (config == null) {
    throw new Error(
      [
        `MUI: The token "${formatToken}" is not supported by the Date and Time Pickers.`,
        'Please try using another token or open an issue on https://github.com/mui/mui-x/issues/new/choose if you think it should be supported.',
      ].join('\n'),
    );
  }

  if (typeof config === 'string') {
    return {
      dateSectionName: config,
      contentType: config === 'meridiem' ? 'letter' : 'digit',
    };
  }

  return {
    dateSectionName: config.sectionName,
    contentType: config.contentType,
  };
};

const getDeltaFromKeyCode = (keyCode: Omit<AvailableAdjustKeyCode, 'Home' | 'End'>) => {
  switch (keyCode) {
    case 'ArrowUp':
      return 1;
    case 'ArrowDown':
      return -1;
    case 'PageUp':
      return 5;
    case 'PageDown':
      return -5;
    default:
      return 0;
  }
};

export const getDaysInWeekStr = <TDate>(utils: MuiPickersAdapter<TDate>, format: string) => {
  const elements: TDate[] = [];

  const now = utils.date()!;
  const startDate = utils.startOfWeek(now);
  const endDate = utils.endOfWeek(now);

  let current = startDate;
  while (utils.isBefore(current, endDate)) {
    elements.push(current);
    current = utils.addDays(current, 1);
  }

  return elements.map((weekDay) => utils.formatByString(weekDay, format));
};

export const adjustDateSectionValue = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  dateSectionName: MuiDateSectionName,
  keyCode: AvailableAdjustKeyCode,
): TDate => {
  const delta = getDeltaFromKeyCode(keyCode);
  const isStart = keyCode === 'Home';
  const isEnd = keyCode === 'End';

  switch (dateSectionName) {
    case 'day': {
      if (isStart) {
        return utils.startOfMonth(date);
      }
      if (isEnd) {
        return utils.endOfMonth(date);
      }
      return utils.addDays(date, delta);
    }
    case 'weekDay': {
      if (isStart) {
        return utils.startOfWeek(date);
      }
      if (isEnd) {
        return utils.endOfWeek(date);
      }
      return utils.addDays(date, delta);
    }
    case 'month': {
      if (isStart) {
        return utils.startOfYear(date);
      }
      if (isEnd) {
        return utils.endOfYear(date);
      }
      return utils.addMonths(date, delta);
    }
    case 'year': {
      return utils.addYears(date, delta);
    }
    case 'meridiem': {
      return utils.addHours(date, (delta > 0 ? 1 : -1) * 12);
    }
    case 'hours': {
      if (isStart) {
        return utils.startOfDay(date);
      }
      if (isEnd) {
        return utils.endOfDay(date);
      }
      return utils.addHours(date, delta);
    }
    case 'minutes': {
      if (isStart) {
        return utils.setMinutes(date, 0);
      }
      if (isEnd) {
        return utils.setMinutes(date, 59);
      }
      return utils.addMinutes(date, delta);
    }
    case 'seconds': {
      if (isStart) {
        return utils.setSeconds(date, 0);
      }
      if (isEnd) {
        return utils.setSeconds(date, 59);
      }
      return utils.addSeconds(date, delta);
    }
    default: {
      return date;
    }
  }
};

export const adjustInvalidDateSectionValue = <TDate, TSection extends FieldSection>(
  utils: MuiPickersAdapter<TDate>,
  section: TSection,
  keyCode: AvailableAdjustKeyCode,
): string => {
  const today = utils.date()!;
  const delta = getDeltaFromKeyCode(keyCode);
  const isStart = keyCode === 'Home';
  const isEnd = keyCode === 'End';
  const shouldSetAbsolute = section.value === '' || isStart || isEnd;

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
      if (shouldSetAbsolute) {
        if (delta > 0 || isEnd) {
          newDate = utils.startOfYear(today);
        } else {
          newDate = utils.endOfYear(today);
        }
      } else {
        newDate = utils.addMonths(utils.parse(section.value, section.formatValue)!, delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'day': {
      let newDate: TDate;
      if (shouldSetAbsolute) {
        if (delta > 0 || isEnd) {
          newDate = utils.startOfMonth(today);
        } else {
          newDate = utils.endOfMonth(today);
        }
      } else {
        newDate = utils.addDays(utils.parse(section.value, section.formatValue)!, delta);
        if (!utils.isSameMonth(newDate, today)) {
          if (delta > 0) {
            newDate = utils.startOfMonth(today);
          } else {
            newDate = utils.endOfMonth(today);
          }
        }
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'weekDay': {
      let newDate: TDate;
      if (shouldSetAbsolute) {
        if (delta > 0 || isEnd) {
          newDate = utils.startOfWeek(today);
        } else {
          newDate = utils.endOfWeek(today);
        }

        return utils.formatByString(newDate, section.formatValue);
      }

      const formattedDaysInWeek = getDaysInWeekStr(utils, section.formatValue);
      const currentDayInWeek = formattedDaysInWeek.indexOf(section.value);
      const newDayInWeek =
        (currentDayInWeek + formattedDaysInWeek.length + delta) % formattedDaysInWeek.length;

      return formattedDaysInWeek[newDayInWeek];
    }

    case 'meridiem': {
      const am = utils.formatByString(utils.startOfDay(today), section.formatValue);
      const pm = utils.formatByString(utils.endOfDay(today), section.formatValue);

      if (section.value === '') {
        if (delta > 0 || isEnd) {
          return am;
        }
        return pm;
      }

      if (section.value === am) {
        return pm;
      }

      return am;
    }

    case 'hours': {
      let newDate: TDate;
      if (shouldSetAbsolute) {
        if (delta > 0 || isEnd) {
          newDate = utils.startOfDay(today);
        } else {
          newDate = utils.endOfDay(today);
        }
      } else {
        newDate = utils.addHours(utils.setHours(today, Number(section.value)), delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'minutes': {
      let newDate: TDate;
      if (section.value === '') {
        // TODO: Add startOfHour and endOfHours to adapters to avoid hard-coding those values
        const newNumericValue = delta > 0 || isEnd ? 0 : 59;
        newDate = utils.setMinutes(today, newNumericValue);
      } else {
        newDate = utils.addMinutes(utils.setMinutes(today, Number(section.value)), delta);
      }

      return utils.formatByString(newDate, section.formatValue);
    }

    case 'seconds': {
      let newDate: TDate;
      if (section.value === '') {
        // TODO: Add startOfMinute and endOfMinute to adapters to avoid hard-coding those values
        const newNumericValue = delta > 0 || isEnd ? 0 : 59;
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

export const getSectionVisibleValue = (
  section: Omit<FieldSection, 'start' | 'end' | 'startInInput' | 'endInInput'>,
  willBeRenderedInInput: boolean,
) => {
  const value = section.value || section.placeholder;

  // In the input, we add an empty character at the end of each section without trailing zeros.
  // This make sure that `onChange` will always be fired.
  // Otherwise, when your input value equals `1/dd/yyyy` (format `M/DD/YYYY` on DayJs),
  // If you press `1`, on the first section, the new value is also `1/dd/yyyy`,
  // So the browser will not fire the input `onChange`.
  // Adding the ltr mark is not a problem because it's only for digit (which are always ltr)
  // The \u2068 and \u2069 are cleaned, but not the \u200e to notice that an update with same digit occures
  if (willBeRenderedInInput && section.contentType === 'digit' && !section.hasTrailingZeroes) {
    return `\u2068${value}\u200e\u2069`;
  }

  if (willBeRenderedInInput) {
    return `\u2068${value}\u2069`;
  }
  return value;
};

export const cleanString = (dirtyString: string) =>
  dirtyString.replace(/\u2066|\u2067|\u2068|\u2069/g, '');

export const addPositionPropertiesToSections = <TSection extends FieldSection>(
  sections: Omit<TSection, 'start' | 'end' | 'startInInput' | 'endInInput'>[],
): TSection[] => {
  let position = 0;
  let positionInInput = 1;
  const newSections: TSection[] = [];

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const renderedValue = getSectionVisibleValue(section, true);
    const sectionStr = `${section.startSeparator}${renderedValue}${section.endSeparator}`;

    const sectionLength = cleanString(sectionStr).length;
    const sectionLengthInInput = sectionStr.length;

    // The ...InInput values consider the unicode characters but do include them in their indexes
    const cleanedValue = cleanString(renderedValue);
    const startInInput =
      positionInInput + renderedValue.indexOf(cleanedValue[0]) + section.startSeparator.length;
    const endInInput = startInInput + cleanedValue.length;

    newSections.push({
      ...section,
      start: position,
      end: position + sectionLength,
      startInInput,
      endInInput,
    } as TSection);
    position += sectionLength;
    // Move position to the end of string associated to the current section
    positionInInput += sectionLengthInInput;
  }

  return newSections;
};

const getSectionPlaceholder = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  localeText: PickersLocaleText<TDate>,
  sectionConfig: Pick<FieldSection, 'dateSectionName' | 'contentType'>,
  currentTokenValue: string,
) => {
  switch (sectionConfig.dateSectionName) {
    case 'year': {
      return localeText.fieldYearPlaceholder({
        digitAmount: utils.formatByString(utils.date()!, currentTokenValue).length,
      });
    }

    case 'month': {
      return localeText.fieldMonthPlaceholder({
        contentType: sectionConfig.contentType,
      });
    }

    case 'day': {
      return localeText.fieldDayPlaceholder();
    }

    case 'weekDay': {
      return localeText.fieldWeekDayPlaceholder({
        contentType: sectionConfig.contentType,
      });
    }

    case 'hours': {
      return localeText.fieldHoursPlaceholder();
    }

    case 'minutes': {
      return localeText.fieldMinutesPlaceholder();
    }

    case 'seconds': {
      return localeText.fieldSecondsPlaceholder();
    }

    case 'meridiem': {
      return localeText.fieldMeridiemPlaceholder();
    }

    default: {
      return currentTokenValue;
    }
  }
};

export const changeSectionValueFormat = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  valueStr: string,
  currentFormat: string,
  newFormat: string,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (getDateSectionConfigFromFormatToken(utils, currentFormat).dateSectionName === 'weekDay') {
      throw new Error("changeSectionValueFormat doesn't support week day formats");
    }
  }

  return utils.formatByString(utils.parse(valueStr, currentFormat)!, newFormat);
};

export const isFourDigitYearFormat = <TDate>(utils: MuiPickersAdapter<TDate>, format: string) =>
  utils.formatByString(utils.date()!, format).length === 4;

export const doesSectionHaveTrailingZeros = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  contentType: 'digit' | 'letter',
  dateSectionName: MuiDateSectionName,
  format: string,
) => {
  if (contentType !== 'digit') {
    return false;
  }

  if (dateSectionName === 'weekDay') {
    return utils.formatByString(utils.startOfWeek(utils.date()!), format).length > 1;
  }

  // We can't use `changeSectionValueFormat`, because  `utils.parse('1', 'YYYY')` returns `1971` instead of `1`.
  if (dateSectionName === 'year') {
    if (isFourDigitYearFormat(utils, format)) {
      const formatted0001 = utils.formatByString(utils.setYear(utils.date()!, 1), format);
      return formatted0001 === '0001';
    }

    const formatted2001 = utils.formatByString(utils.setYear(utils.date()!, 2001), format);
    return formatted2001 === '01';
  }

  return changeSectionValueFormat(utils, '1', format, format).length > 1;
};

const getEscapedPartsFromExpandedFormat = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  expandedFormat: string,
) => {
  const escapedParts: { start: number; end: number }[] = [];
  const { start: startChar, end: endChar } = utils.escapedCharacters;
  const regExp = new RegExp(`(\\${startChar}[^\\${endChar}]*\\${endChar})+`, 'g');

  let match: RegExpExecArray | null = null;
  // eslint-disable-next-line no-cond-assign
  while ((match = regExp.exec(expandedFormat))) {
    escapedParts.push({ start: match.index, end: regExp.lastIndex - 1 });
  }

  return escapedParts;
};

export const splitFormatIntoSections = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  localeText: PickersLocaleText<TDate>,
  format: string,
  date: TDate | null,
) => {
  const expandedFormat = utils.expandFormat(format);
  const escapedParts = getEscapedPartsFromExpandedFormat(utils, expandedFormat);
  let currentTokenValue = '';
  let startSeparator: string = '';
  const sections: Omit<FieldSection, 'start' | 'end' | 'startInInput' | 'endInInput'>[] = [];

  const commitCurrentToken = () => {
    if (currentTokenValue === '') {
      return;
    }

    const sectionConfig = getDateSectionConfigFromFormatToken(utils, currentTokenValue);
    const sectionValue = date == null ? '' : utils.formatByString(date, currentTokenValue);

    const hasTrailingZeroes = doesSectionHaveTrailingZeros(
      utils,
      sectionConfig.contentType,
      sectionConfig.dateSectionName,
      currentTokenValue,
    );

    sections.push({
      ...sectionConfig,
      formatValue: currentTokenValue,
      value: sectionValue,
      placeholder: getSectionPlaceholder(utils, localeText, sectionConfig, currentTokenValue),
      hasTrailingZeroes,
      startSeparator: sections.length === 0 ? startSeparator : '',
      endSeparator: '',
      edited: false,
    });

    currentTokenValue = '';
  };

  for (let i = 0; i < expandedFormat.length; i += 1) {
    const escapedPartOfCurrentChar = escapedParts.find(
      (escapeIndex) => escapeIndex.start <= i && escapeIndex.end >= i,
    );

    const char = expandedFormat[i];

    const isEscapedChar = escapedPartOfCurrentChar != null;

    if (!isEscapedChar && char.match(/([A-Za-z]+)/)) {
      currentTokenValue += char;
    } else {
      // If we are on the opening or closing character of an escaped part of the format,
      // Then we ignore this character.
      const isEscapeBoundary =
        (isEscapedChar && escapedPartOfCurrentChar?.start === i) ||
        escapedPartOfCurrentChar?.end === i;

      if (!isEscapeBoundary) {
        commitCurrentToken();
        if (sections.length === 0) {
          startSeparator += char;
        } else {
          sections[sections.length - 1].endSeparator += char;
        }
      }
    }
  }

  commitCurrentToken();

  const cleanSections = sections.map((section) => {
    const cleanSeparator = (separator: string) => {
      let cleanedSeparator = separator;
      if (cleanedSeparator !== null && cleanedSeparator.includes(' ')) {
        cleanedSeparator = `\u2069${cleanedSeparator}\u2066`;
      }

      if (cleanedSeparator === '/') {
        cleanedSeparator = ' / ';
      }

      return cleanedSeparator;
    };

    section.startSeparator = cleanSeparator(section.startSeparator);
    section.endSeparator = cleanSeparator(section.endSeparator);

    return section;
  });

  return cleanSections;
};

/**
 * Some date libraries like `dayjs` don't support parsing from date with escaped characters.
 * To make sure that the parsing works, we are building a format and a date without any separator.
 */
export const getDateFromDateSections = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  sections: FieldSection[],
) => {
  // If we have both a day and a weekDay section,
  // Then we skip the weekDay in the parsing because libraries like dayjs can't parse complicated formats containing a weekDay.
  // dayjs(dayjs().format('dddd MMMM D YYYY'), 'dddd MMMM D YYYY')) // returns `Invalid Date` even if the format is valid.
  const shouldSkipWeekDays = sections.some((section) => section.dateSectionName === 'day');

  const sectionFormats: string[] = [];
  const sectionValues: string[] = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];

    const shouldSkip = shouldSkipWeekDays && section.dateSectionName === 'weekDay';
    if (!shouldSkip) {
      sectionFormats.push(section.formatValue);
      sectionValues.push(getSectionVisibleValue(section, false));
    }
  }

  const formatWithoutSeparator = sectionFormats.join(' ');
  const dateWithoutSeparatorStr = sectionValues.join(' ');

  return utils.parse(dateWithoutSeparatorStr, formatWithoutSeparator);
};

export const createDateStrForInputFromSections = (sections: FieldSection[]) => {
  const formattedArray = sections.map(
    (section) =>
      `${section.startSeparator}${getSectionVisibleValue(section, true)}${section.endSeparator}`,
  );

  // \u2066: start left-to-right isolation
  // \u2067: start right-to-left isolation
  // \u2068: start first strong character isolation
  // \u2069: pop isolation
  // wrap into an isolated group such that separators can split the string in smaller ones by adding \u2069\u2068
  return `\u2066${formattedArray.join('')}\u2069`;
};

export const getSectionsBoundaries = <TDate>(
  utils: MuiPickersAdapter<TDate>,
): FieldSectionsValueBoundaries<TDate> => {
  const today = utils.date()!;

  const endOfYear = utils.endOfYear(today);

  const maxDaysInMonth = utils.getMonthArray(today).reduce((acc, month) => {
    const daysInMonth = utils.getDaysInMonth(month);
    return Math.max(acc, daysInMonth);
  }, 0);

  return {
    year: ({ format }) => ({
      minimum: 0,
      maximum: isFourDigitYearFormat(utils, format) ? 9999 : 99,
    }),
    month: () => ({
      minimum: 1,
      // Assumption: All years have the same amount of months
      maximum: utils.getMonth(endOfYear) + 1,
    }),
    day: ({ currentDate }) => ({
      minimum: 1,
      maximum:
        currentDate != null && utils.isValid(currentDate)
          ? utils.getDaysInMonth(currentDate)
          : maxDaysInMonth,
    }),
    weekDay: ({ format, contentType }) => {
      if (contentType === 'digit') {
        const daysInWeek = getDaysInWeekStr(utils, format).map(Number);
        return {
          minimum: Math.min(...daysInWeek),
          maximum: Math.max(...daysInWeek),
        };
      }

      return {
        minimum: 1,
        maximum: 7,
      };
    },
    hours: ({ format }) => {
      const hoursInDay = utils.getHours(endOfYear);
      const hasMeridiem =
        utils.formatByString(utils.endOfDay(today), format) !== hoursInDay.toString();

      return {
        minimum: 0,
        // Assumption: All days have the same amount of hours
        maximum: hasMeridiem
          ? Number(utils.formatByString(utils.startOfDay(today), format))
          : hoursInDay,
      };
    },
    minutes: () => ({
      minimum: 0,
      // Assumption: All years have the same amount of minutes
      maximum: utils.getMinutes(endOfYear),
    }),
    seconds: () => ({
      minimum: 0,
      // Assumption: All years have the same amount of seconds
      maximum: utils.getSeconds(endOfYear),
    }),
    meridiem: () => ({
      minimum: 0,
      maximum: 0,
    }),
  };
};

/**
 * @template TDate
 * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.*
 * @param {TDate} date The date on which the meridiem must be applied.
 * @param {string} sectionValue The new value of the meridiem section.
 * @returns {TDate} The date with the new meridiem.
 */
export const applyMeridiemChange = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  sectionValue: string,
) => {
  const isAM = sectionValue.toLowerCase() === 'am';
  const hours = utils.getHours(date);

  if (isAM && hours >= 12) {
    return utils.addHours(date, -12);
  }
  if (!isAM && hours < 12) {
    return utils.addHours(date, 12);
  }

  return date;
};

/**
 * @template TDate
 * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.*
 * @param {TDate} date The date on which the week day must be applied.
 * @param {string} sectionFormat The format of the week day section.
 * @param {string} sectionValue The new value of the week day section.
 * @returns {TDate} The date with the new week day.
 */
export const applyWeekDayChange = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  sectionFormat: string,
  sectionValue: string,
) => {
  const formattedDaysInWeek = getDaysInWeekStr(utils, sectionFormat);
  const dayInWeekStrOfActiveDate = utils.formatByString(date, sectionFormat);
  const dayInWeekOfActiveDate = formattedDaysInWeek.indexOf(dayInWeekStrOfActiveDate);
  const dayInWeekOfNewSectionValue = formattedDaysInWeek.indexOf(sectionValue);

  const diff = dayInWeekOfNewSectionValue - dayInWeekOfActiveDate;

  return utils.addDays(date, diff);
};

export const getDateSectionGetterAndSetter = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  dateSectionName: Exclude<MuiDateSectionName, 'weekDay' | 'meridiem'>,
) => {
  const adapterMethods: Record<
    typeof dateSectionName,
    { getter: (date: TDate) => number; setter: (date: TDate, value: number) => TDate }
  > = {
    seconds: {
      getter: utils.getSeconds,
      setter: utils.setSeconds,
    },
    minutes: {
      getter: utils.getMinutes,
      setter: utils.setMinutes,
    },
    hours: {
      getter: utils.getHours,
      setter: utils.setHours,
    },
    day: {
      getter: utils.getDate,
      setter: utils.setDate,
    },
    month: {
      getter: utils.getMonth,
      setter: utils.setMonth,
    },
    year: {
      getter: utils.getYear,
      setter: utils.setYear,
    },
  };

  return adapterMethods[dateSectionName];
};
export const cleanTrailingZeroInNumericSectionValue = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  format: string,
  value: string,
) => {
  const size = utils.formatByString(utils.date()!, format).length;
  let cleanValue = value;

  // We remove the trailing zeros
  cleanValue = Number(cleanValue).toString();

  // We add enough trailing zeros to fill the section
  while (cleanValue.length < size) {
    cleanValue = `0${cleanValue}`;
  }

  return cleanValue;
};

let warnedOnceInvalidSection = false;

export const validateSections = <TSection extends FieldSection>(
  sections: TSection[],
  valueType: FieldValueType,
) => {
  const supportedSections: MuiDateSectionName[] = [];
  if (['date', 'date-time'].includes(valueType)) {
    supportedSections.push('weekDay', 'day', 'month', 'year');
  }
  if (['time', 'date-time'].includes(valueType)) {
    supportedSections.push('hours', 'minutes', 'seconds', 'meridiem');
  }

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceInvalidSection) {
      const invalidSection = sections.find(
        (section) => !supportedSections.includes(section.dateSectionName),
      );

      if (invalidSection) {
        console.warn(
          `MUI: The field component you are using is not compatible with the "${invalidSection.dateSectionName} date section.`,
          `The supported date sections are ["${supportedSections.join('", "')}"]\`.`,
        );
        warnedOnceInvalidSection = true;
      }
    }
  }
};

export const mergeDateIntoReferenceDate = <
  TDate,
  TSection extends Omit<FieldSection, 'start' | 'end' | 'startInInput' | 'endInInput'>,
>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
  sections: TSection[],
  referenceDate: TDate,
  shouldLimitToEditedSections: boolean,
) => {
  let mergedDate = referenceDate;

  sections.forEach((section) => {
    if (!shouldLimitToEditedSections || section.edited) {
      if (section.dateSectionName === 'meridiem') {
        mergedDate = applyMeridiemChange(
          utils,
          mergedDate,
          utils.getHours(date) < 12 ? 'AM' : 'PM',
        );
      } else if (section.dateSectionName === 'weekDay') {
        mergedDate = applyWeekDayChange(utils, mergedDate, section.formatValue, section.value);
      } else {
        const { getter, setter } = getDateSectionGetterAndSetter(utils, section.dateSectionName);
        mergedDate = setter(mergedDate, getter(date));
      }
    }
  });

  return mergedDate;
};

export const isAndroid = () => navigator.userAgent.toLowerCase().indexOf('android') > -1;

export const clampDaySection = <TDate, TSection extends FieldSection>(
  utils: MuiPickersAdapter<TDate>,
  sections: TSection[],
  sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate>,
) => {
  // We try to generate a valid date representing the start of the month of the invalid date typed by the user.
  const sectionsForStartOfMonth = sections.map((section) => {
    if (section.dateSectionName !== 'day') {
      return section;
    }

    const dayBoundaries = sectionsValueBoundaries.day({
      currentDate: null,
      format: section.formatValue,
      contentType: section.contentType,
    });

    return {
      ...section,
      value: section.hasTrailingZeroes
        ? cleanTrailingZeroInNumericSectionValue(
            utils,
            section.formatValue,
            dayBoundaries.minimum.toString(),
          )
        : dayBoundaries.minimum.toString(),
    };
  });

  const startOfMonth = getDateFromDateSections(utils, sectionsForStartOfMonth);

  // Even the start of the month is invalid, we probably have other invalid sections, the clamping failed.
  if (startOfMonth == null || !utils.isValid(startOfMonth)) {
    return null;
  }

  // The only invalid section was the day of the month, we replace its value with the maximum boundary for the correct month.
  return sections.map((section) => {
    if (section.dateSectionName !== 'day') {
      return section;
    }

    const dayBoundaries = sectionsValueBoundaries.day({
      currentDate: startOfMonth,
      format: section.formatValue,
      contentType: section.contentType,
    });
    if (Number(section.value) <= dayBoundaries.maximum) {
      return section;
    }

    return {
      ...section,
      value: dayBoundaries.maximum.toString(),
    };
  });
};

export const getSectionOrder = (
  sections: Omit<FieldSection, 'start' | 'end' | 'startInInput' | 'endInInput'>[],
  isRTL: boolean,
): SectionOrdering => {
  const neighbors: SectionNeighbors = {};
  if (!isRTL) {
    sections.forEach((_, index) => {
      const leftIndex = index === 0 ? null : index - 1;
      const rightIndex = index === sections.length - 1 ? null : index + 1;
      neighbors[index] = { leftIndex, rightIndex };
    });
    return { neighbors, startIndex: 0, endIndex: sections.length - 1 };
  }

  type PotisionMapping = { [from: number]: number };
  const rtl2ltr: PotisionMapping = {};
  const ltr2rtl: PotisionMapping = {};

  let groupedSectionsStart = 0;
  let groupedSectionsEnd = 0;
  let RTLIndex = sections.length - 1;

  while (RTLIndex >= 0) {
    groupedSectionsEnd = sections.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (section, index) => index >= groupedSectionsStart && section.endSeparator?.includes(' '),
    );
    if (groupedSectionsEnd === -1) {
      groupedSectionsEnd = sections.length - 1;
    }

    for (let i = groupedSectionsEnd; i >= groupedSectionsStart; i -= 1) {
      ltr2rtl[i] = RTLIndex;
      rtl2ltr[RTLIndex] = i;
      RTLIndex -= 1;
    }
    groupedSectionsStart = groupedSectionsEnd + 1;
  }

  sections.forEach((_, index) => {
    const rtlIndex = ltr2rtl[index];
    const leftIndex = rtlIndex === 0 ? null : rtl2ltr[rtlIndex - 1];
    const rightIndex = rtlIndex === sections.length - 1 ? null : rtl2ltr[rtlIndex + 1];

    neighbors[index] = { leftIndex, rightIndex };
  });

  return { neighbors, startIndex: rtl2ltr[0], endIndex: rtl2ltr[sections.length - 1] };
};
