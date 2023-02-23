import {
  FieldSection,
  AvailableAdjustKeyCode,
  FieldSectionsValueBoundaries,
  SectionNeighbors,
  SectionOrdering,
  FieldValueType,
  FieldSectionWithoutPosition,
} from './useField.types';
import { MuiPickersAdapter, MuiDateSectionName } from '../../models';
import { PickersLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export const getDateSectionConfigFromFormatToken = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  formatToken: string,
): Pick<FieldSection, 'name' | 'contentType'> => {
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
      name: config,
      contentType: config === 'meridiem' ? 'letter' : 'digit',
    };
  }

  return {
    name: config.sectionName,
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

export const cleanLeadingZerosInNumericSectionValue = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  format: string,
  value: string,
) => {
  const size = utils.formatByString(utils.date()!, format).length;
  let cleanValue = value;

  // We remove the leading zeros
  cleanValue = Number(cleanValue).toString();

  // We add enough leading zeros to fill the section
  while (cleanValue.length < size) {
    cleanValue = `0${cleanValue}`;
  }

  return cleanValue;
};

export const getLetterEditingOptions = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  dateSectionName: MuiDateSectionName,
  format: string,
) => {
  switch (dateSectionName) {
    case 'month': {
      return utils
        .getMonthArray(utils.date()!)
        .map((month) => utils.formatByString(month, format!));
    }

    case 'weekDay': {
      return getDaysInWeekStr(utils, format);
    }

    case 'meridiem': {
      const now = utils.date()!;
      return [utils.startOfDay(now), utils.endOfDay(now)].map((date) =>
        utils.formatByString(date, format),
      );
    }

    default: {
      return [];
    }
  }
};

export const adjustSectionValue = <TDate, TSection extends FieldSection>(
  utils: MuiPickersAdapter<TDate>,
  section: TSection,
  keyCode: AvailableAdjustKeyCode,
  sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate>,
  activeDate: TDate | null,
): string => {
  const delta = getDeltaFromKeyCode(keyCode);
  const isStart = keyCode === 'Home';
  const isEnd = keyCode === 'End';

  const shouldSetAbsolute = section.value === '' || isStart || isEnd;

  const cleanDigitSectionValue = (value: number) => {
    const valueStr = value.toString();
    if (section.hasLeadingZeros) {
      return cleanLeadingZerosInNumericSectionValue(utils, section.format, valueStr);
    }

    return valueStr;
  };

  const adjustDigitSection = () => {
    const sectionBoundaries = sectionsValueBoundaries[section.name]({
      currentDate: activeDate,
      format: section.format,
      contentType: section.contentType,
    });

    if (shouldSetAbsolute) {
      if (section.name === 'year' && !isEnd && !isStart) {
        return utils.formatByString(utils.date()!, section.format);
      }

      if (delta > 0 || isStart) {
        return cleanDigitSectionValue(sectionBoundaries.minimum);
      }

      return cleanDigitSectionValue(sectionBoundaries.maximum);
    }

    const currentSectionValue = Number(section.value);
    const newSectionValueNumber = currentSectionValue + delta;

    if (newSectionValueNumber > sectionBoundaries.maximum) {
      return cleanDigitSectionValue(sectionBoundaries.minimum);
    }

    if (newSectionValueNumber < sectionBoundaries.minimum) {
      return cleanDigitSectionValue(sectionBoundaries.maximum);
    }

    return cleanDigitSectionValue(newSectionValueNumber);
  };

  const adjustLetterSection = () => {
    const options = getLetterEditingOptions(utils, section.name, section.format);
    if (options.length === 0) {
      return section.value;
    }

    if (shouldSetAbsolute) {
      if (delta > 0 || isStart) {
        return options[0];
      }

      return options[options.length - 1];
    }

    const currentOptionIndex = options.indexOf(section.value);
    const newOptionIndex = (currentOptionIndex + options.length + delta) % options.length;

    return options[newOptionIndex];
  };

  if (section.contentType === 'digit') {
    return adjustDigitSection();
  }

  return adjustLetterSection();
};

const getSectionVisibleValue = (
  section: FieldSectionWithoutPosition,
  willBeRenderedInInput: boolean,
) => {
  const value = section.value || section.placeholder;

  // In the input, we add an empty character at the end of each section without leading zeros.
  // This makes sure that `onChange` will always be fired.
  // Otherwise, when your input value equals `1/dd/yyyy` (format `M/DD/YYYY` on DayJs),
  // If you press `1`, on the first section, the new value is also `1/dd/yyyy`,
  // So the browser will not fire the input `onChange`.
  // Adding the ltr mark is not a problem because it's only for digit (which are always ltr)
  // The \u2068 and \u2069 are cleaned, but not the \u200e to notice that an update with same digit occurs
  if (
    willBeRenderedInInput &&
    section.contentType === 'digit' &&
    !section.hasLeadingZeros &&
    value.length === 1
  ) {
    return `\u2068${value}\u200e\u2069`;
  }

  if (willBeRenderedInInput) {
    return `\u2068${value}\u2069`;
  }
  return value;
};

export const cleanString = (dirtyString: string) =>
  dirtyString.replace(/[\u2066\u2067\u2068\u2069]/g, '');

export const addPositionPropertiesToSections = <TSection extends FieldSection>(
  sections: FieldSectionWithoutPosition<TSection>[],
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
  sectionConfig: Pick<FieldSection, 'name' | 'contentType'>,
  currentTokenValue: string,
) => {
  switch (sectionConfig.name) {
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
    if (getDateSectionConfigFromFormatToken(utils, currentFormat).name === 'weekDay') {
      throw new Error("changeSectionValueFormat doesn't support week day formats");
    }
  }

  return utils.formatByString(utils.parse(valueStr, currentFormat)!, newFormat);
};

const isFourDigitYearFormat = <TDate>(utils: MuiPickersAdapter<TDate>, format: string) =>
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

  switch (dateSectionName) {
    // We can't use `changeSectionValueFormat`, because  `utils.parse('1', 'YYYY')` returns `1971` instead of `1`.
    case 'year': {
      if (isFourDigitYearFormat(utils, format)) {
        const formatted0001 = utils.formatByString(utils.setYear(utils.date()!, 1), format);
        return formatted0001 === '0001';
      }

      const formatted2001 = utils.formatByString(utils.setYear(utils.date()!, 2001), format);
      return formatted2001 === '01';
    }

    case 'month': {
      return utils.formatByString(utils.startOfYear(utils.date()!), format).length > 1;
    }

    case 'day': {
      return utils.formatByString(utils.startOfMonth(utils.date()!), format).length > 1;
    }

    case 'weekDay': {
      return utils.formatByString(utils.startOfWeek(utils.date()!), format).length > 1;
    }

    case 'hours': {
      return utils.formatByString(utils.setHours(utils.date()!, 1), format).length > 1;
    }

    case 'minutes': {
      return utils.formatByString(utils.setMinutes(utils.date()!, 1), format).length > 1;
    }

    case 'seconds': {
      return utils.formatByString(utils.setMinutes(utils.date()!, 1), format).length > 1;
    }

    default: {
      throw new Error('Invalid dateSectionName');
    }
  }
};

const getEscapedPartsFromFormat = <TDate>(utils: MuiPickersAdapter<TDate>, format: string) => {
  const escapedParts: { start: number; end: number }[] = [];
  const { start: startChar, end: endChar } = utils.escapedCharacters;
  const regExp = new RegExp(`(\\${startChar}[^\\${endChar}]*\\${endChar})+`, 'g');

  let match: RegExpExecArray | null = null;
  // eslint-disable-next-line no-cond-assign
  while ((match = regExp.exec(format))) {
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
  let startSeparator: string = '';
  const sections: FieldSectionWithoutPosition[] = [];

  const commitToken = (token: string) => {
    if (token === '') {
      return null;
    }

    const expandedToken = utils.expandFormat(token);
    if (expandedToken !== token) {
      return expandedToken;
    }

    const sectionConfig = getDateSectionConfigFromFormatToken(utils, token);
    const sectionValue = date == null ? '' : utils.formatByString(date, token);

    const hasTrailingZeroes = doesSectionHaveTrailingZeros(
      utils,
      sectionConfig.contentType,
      sectionConfig.name,
      token,
    );

    sections.push({
      ...sectionConfig,
      format: token,
      value: sectionValue,
      placeholder: getSectionPlaceholder(utils, localeText, sectionConfig, token),
      hasLeadingZeros: hasTrailingZeroes,
      startSeparator: sections.length === 0 ? startSeparator : '',
      endSeparator: '',
      modified: false,
    });

    return null;
  };

  const splitFormat = (token: string) => {
    const escapedParts = getEscapedPartsFromFormat(utils, token);
    let currentTokenValue = '';

    for (let i = 0; i < token.length; i += 1) {
      const escapedPartOfCurrentChar = escapedParts.find(
        (escapeIndex) => escapeIndex.start <= i && escapeIndex.end >= i,
      );

      const char = token[i];
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
          const expandedToken = commitToken(currentTokenValue);
          if (expandedToken != null) {
            splitFormat(expandedToken);
          }

          currentTokenValue = '';
          if (sections.length === 0) {
            startSeparator += char;
          } else {
            sections[sections.length - 1].endSeparator += char;
          }
        }
      }
    }

    const expandedToken = commitToken(currentTokenValue);
    if (expandedToken != null) {
      splitFormat(expandedToken);
    }
  };

  splitFormat(format);

  return sections.map((section) => {
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
  const shouldSkipWeekDays = sections.some((section) => section.name === 'day');

  const sectionFormats: string[] = [];
  const sectionValues: string[] = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];

    const shouldSkip = shouldSkipWeekDays && section.name === 'weekDay';
    if (!shouldSkip) {
      sectionFormats.push(section.format);
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
      const lastHourInDay = utils.getHours(endOfYear);
      const hasMeridiem =
        utils.formatByString(utils.endOfDay(today), format) !== lastHourInDay.toString();

      if (hasMeridiem) {
        return {
          minimum: 1,
          maximum: Number(utils.formatByString(utils.startOfDay(today), format)),
        };
      }

      return {
        minimum: 0,
        maximum: lastHourInDay,
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

let warnedOnceInvalidSection = false;

export const validateSections = <TSection extends FieldSection>(
  sections: TSection[],
  valueType: FieldValueType,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceInvalidSection) {
      const supportedSections: MuiDateSectionName[] = [];
      if (['date', 'date-time'].includes(valueType)) {
        supportedSections.push('weekDay', 'day', 'month', 'year');
      }
      if (['time', 'date-time'].includes(valueType)) {
        supportedSections.push('hours', 'minutes', 'seconds', 'meridiem');
      }

      const invalidSection = sections.find((section) => !supportedSections.includes(section.name));

      if (invalidSection) {
        console.warn(
          `MUI: The field component you are using is not compatible with the "${invalidSection.name} date section.`,
          `The supported date sections are ["${supportedSections.join('", "')}"]\`.`,
        );
        warnedOnceInvalidSection = true;
      }
    }
  }
};

const transferDateSectionValue = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  section: FieldSectionWithoutPosition,
  dateToTransferFrom: TDate,
  dateToTransferTo: TDate,
) => {
  switch (section.name) {
    case 'year': {
      return utils.setYear(dateToTransferTo, utils.getYear(dateToTransferFrom));
    }

    case 'month': {
      return utils.setMonth(dateToTransferTo, utils.getMonth(dateToTransferFrom));
    }

    case 'weekDay': {
      const formattedDaysInWeek = getDaysInWeekStr(utils, section.format);
      const dayInWeekStrOfActiveDate = utils.formatByString(dateToTransferFrom, section.format);
      const dayInWeekOfActiveDate = formattedDaysInWeek.indexOf(dayInWeekStrOfActiveDate);
      const dayInWeekOfNewSectionValue = formattedDaysInWeek.indexOf(section.value);
      const diff = dayInWeekOfNewSectionValue - dayInWeekOfActiveDate;

      return utils.addDays(dateToTransferFrom, diff);
    }

    case 'day': {
      return utils.setDate(dateToTransferTo, utils.getDate(dateToTransferFrom));
    }

    case 'meridiem': {
      const isAM = utils.getHours(dateToTransferFrom) < 12;
      const mergedDateHours = utils.getHours(dateToTransferTo);

      if (isAM && mergedDateHours >= 12) {
        return utils.addHours(dateToTransferTo, -12);
      }

      if (!isAM && mergedDateHours < 12) {
        return utils.addHours(dateToTransferTo, 12);
      }

      return dateToTransferTo;
    }

    case 'hours': {
      return utils.setHours(dateToTransferTo, utils.getHours(dateToTransferFrom));
    }

    case 'minutes': {
      return utils.setMinutes(dateToTransferTo, utils.getMinutes(dateToTransferFrom));
    }

    case 'seconds': {
      return utils.setSeconds(dateToTransferTo, utils.getSeconds(dateToTransferFrom));
    }

    default: {
      return dateToTransferTo;
    }
  }
};

export const mergeDateIntoReferenceDate = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  dateToTransferFrom: TDate,
  sections: FieldSectionWithoutPosition[],
  referenceDate: TDate,
  shouldLimitToEditedSections: boolean,
) =>
  sections.reduce((mergedDate, section) => {
    if (!shouldLimitToEditedSections || section.modified) {
      return transferDateSectionValue(utils, section, dateToTransferFrom, mergedDate);
    }

    return mergedDate;
  }, referenceDate);

export const isAndroid = () => navigator.userAgent.toLowerCase().indexOf('android') > -1;

export const clampDaySection = <TDate, TSection extends FieldSection>(
  utils: MuiPickersAdapter<TDate>,
  sections: TSection[],
  sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate>,
) => {
  // We try to generate a valid date representing the start of the month of the invalid date typed by the user.
  const sectionsForStartOfMonth = sections.map((section) => {
    if (section.name !== 'day') {
      return section;
    }

    const dayBoundaries = sectionsValueBoundaries.day({
      currentDate: null,
      format: section.format,
      contentType: section.contentType,
    });

    return {
      ...section,
      value: section.hasLeadingZeros
        ? cleanLeadingZerosInNumericSectionValue(
            utils,
            section.format,
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
    if (section.name !== 'day') {
      return section;
    }

    const dayBoundaries = sectionsValueBoundaries.day({
      currentDate: startOfMonth,
      format: section.format,
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
  sections: FieldSectionWithoutPosition[],
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

  type PositionMapping = { [from: number]: number };
  const rtl2ltr: PositionMapping = {};
  const ltr2rtl: PositionMapping = {};

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
