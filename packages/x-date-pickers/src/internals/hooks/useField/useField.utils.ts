import {
  FieldSectionsValueBoundaries,
  SectionNeighbors,
  SectionOrdering,
  FieldSectionValueBoundaries,
  FieldParsedSelectedSections,
} from './useField.types';
import {
  FieldSectionType,
  FieldSection,
  MuiPickersAdapter,
  FieldSectionContentType,
  PickersTimezone,
  PickerValidDate,
  FieldSelectedSections,
  PickerValueType,
  InferFieldSection,
} from '../../../models';
import { getMonthsInYear } from '../../utils/date-utils';
import { PickerValidValue } from '../../models';

export const getDateSectionConfigFromFormatToken = (
  adapter: MuiPickersAdapter,
  formatToken: string,
): Pick<FieldSection, 'type' | 'contentType'> & { maxLength: number | undefined } => {
  const config = adapter.formatTokenMap[formatToken];

  if (config == null) {
    throw new Error(
      [
        `MUI X: The token "${formatToken}" is not supported by the Date and Time Pickers.`,
        'Please try using another token or open an issue on https://github.com/mui/mui-x/issues/new/choose if you think it should be supported.',
      ].join('\n'),
    );
  }

  if (typeof config === 'string') {
    return {
      type: config,
      contentType: config === 'meridiem' ? 'letter' : 'digit',
      maxLength: undefined,
    };
  }

  return {
    type: config.sectionType,
    contentType: config.contentType,
    maxLength: config.maxLength,
  };
};

export const getDaysInWeekStr = (adapter: MuiPickersAdapter, format: string) => {
  const elements: PickerValidDate[] = [];

  const now = adapter.date(undefined, 'default');
  const startDate = adapter.startOfWeek(now);
  const endDate = adapter.endOfWeek(now);

  let current = startDate;
  while (adapter.isBefore(current, endDate)) {
    elements.push(current);
    current = adapter.addDays(current, 1);
  }

  return elements.map((weekDay) => adapter.formatByString(weekDay, format));
};

export const getLetterEditingOptions = (
  adapter: MuiPickersAdapter,
  timezone: PickersTimezone,
  sectionType: FieldSectionType,
  format: string,
) => {
  switch (sectionType) {
    case 'month': {
      return getMonthsInYear(adapter, adapter.date(undefined, timezone)).map((month) =>
        adapter.formatByString(month, format!),
      );
    }

    case 'weekDay': {
      return getDaysInWeekStr(adapter, format);
    }

    case 'meridiem': {
      const now = adapter.date(undefined, timezone);
      return [adapter.startOfDay(now), adapter.endOfDay(now)].map((date) =>
        adapter.formatByString(date, format),
      );
    }

    default: {
      return [];
    }
  }
};

// This format should be the same on all the adapters
// If some adapter does not respect this convention, then we will need to hardcode the format on each adapter.
export const FORMAT_SECONDS_NO_LEADING_ZEROS = 's';

const NON_LOCALIZED_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const getLocalizedDigits = (adapter: MuiPickersAdapter) => {
  const today = adapter.date(undefined);
  const formattedZero = adapter.formatByString(
    adapter.setSeconds(today, 0),
    FORMAT_SECONDS_NO_LEADING_ZEROS,
  );

  if (formattedZero === '0') {
    return NON_LOCALIZED_DIGITS;
  }

  return Array.from({ length: 10 }).map((_, index) =>
    adapter.formatByString(adapter.setSeconds(today, index), FORMAT_SECONDS_NO_LEADING_ZEROS),
  );
};

export const removeLocalizedDigits = (valueStr: string, localizedDigits: string[]) => {
  if (localizedDigits[0] === '0') {
    return valueStr;
  }

  const digits: string[] = [];
  let currentFormattedDigit = '';
  for (let i = 0; i < valueStr.length; i += 1) {
    currentFormattedDigit += valueStr[i];
    const matchingDigitIndex = localizedDigits.indexOf(currentFormattedDigit);
    if (matchingDigitIndex > -1) {
      digits.push(matchingDigitIndex.toString());
      currentFormattedDigit = '';
    }
  }

  return digits.join('');
};

export const applyLocalizedDigits = (valueStr: string, localizedDigits: string[]) => {
  if (localizedDigits[0] === '0') {
    return valueStr;
  }

  return valueStr
    .split('')
    .map((char) => localizedDigits[Number(char)])
    .join('');
};

export const isStringNumber = (valueStr: string, localizedDigits: string[]) => {
  const nonLocalizedValueStr = removeLocalizedDigits(valueStr, localizedDigits);
  // `Number(' ')` returns `0` even if ' ' is not a valid number.
  return nonLocalizedValueStr !== ' ' && !Number.isNaN(Number(nonLocalizedValueStr));
};

/**
 * Make sure the value of a digit section have the right amount of leading zeros.
 * E.g.: `03` => `3`
 * Warning: Should only be called with non-localized digits. Call `removeLocalizedDigits` with your value if needed.
 */
export const cleanLeadingZeros = (valueStr: string, size: number) => {
  // Remove the leading zeros and then add back as many as needed.
  return Number(valueStr).toString().padStart(size, '0');
};

export const cleanDigitSectionValue = (
  adapter: MuiPickersAdapter,
  value: number,
  sectionBoundaries: FieldSectionValueBoundaries<any>,
  localizedDigits: string[],
  section: Pick<
    FieldSection,
    | 'format'
    | 'type'
    | 'contentType'
    | 'hasLeadingZerosInFormat'
    | 'hasLeadingZerosInInput'
    | 'maxLength'
  >,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (section.type !== 'day' && section.contentType === 'digit-with-letter') {
      throw new Error(
        [
          `MUI X: The token "${section.format}" is a digit format with letter in it.'
             This type of format is only supported for 'day' sections`,
        ].join('\n'),
      );
    }
  }

  if (section.type === 'day' && section.contentType === 'digit-with-letter') {
    const date = adapter.setDate(
      (sectionBoundaries as FieldSectionValueBoundaries<'day'>).longestMonth,
      value,
    );
    return adapter.formatByString(date, section.format);
  }

  // queryValue without leading `0` (`01` => `1`)
  let valueStr = value.toString();

  if (section.hasLeadingZerosInInput) {
    valueStr = cleanLeadingZeros(valueStr, section.maxLength!);
  }

  return applyLocalizedDigits(valueStr, localizedDigits);
};

export const getSectionVisibleValue = (
  section: FieldSection,
  target: 'input-rtl' | 'input-ltr' | 'non-input',
  localizedDigits: string[],
) => {
  let value = section.value || section.placeholder;

  const hasLeadingZeros =
    target === 'non-input' ? section.hasLeadingZerosInFormat : section.hasLeadingZerosInInput;

  if (
    target === 'non-input' &&
    section.hasLeadingZerosInInput &&
    !section.hasLeadingZerosInFormat
  ) {
    value = Number(removeLocalizedDigits(value, localizedDigits)).toString();
  }

  // In the input, we add an empty character at the end of each section without leading zeros.
  // This makes sure that `onChange` will always be fired.
  // Otherwise, when your input value equals `1/dd/yyyy` (format `M/DD/YYYY` on DayJs),
  // If you press `1`, on the first section, the new value is also `1/dd/yyyy`,
  // So the browser will not fire the input `onChange`.
  const shouldAddInvisibleSpace =
    ['input-rtl', 'input-ltr'].includes(target) &&
    section.contentType === 'digit' &&
    !hasLeadingZeros &&
    value.length === 1;

  if (shouldAddInvisibleSpace) {
    value = `${value}\u200e`;
  }

  if (target === 'input-rtl') {
    value = `\u2068${value}\u2069`;
  }

  return value;
};

export const changeSectionValueFormat = (
  adapter: MuiPickersAdapter,
  valueStr: string,
  currentFormat: string,
  newFormat: string,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (getDateSectionConfigFromFormatToken(adapter, currentFormat).type === 'weekDay') {
      throw new Error("changeSectionValueFormat doesn't support week day formats");
    }
  }

  return adapter.formatByString(adapter.parse(valueStr, currentFormat)!, newFormat);
};

const isFourDigitYearFormat = (adapter: MuiPickersAdapter, format: string) =>
  adapter.formatByString(adapter.date(undefined, 'system'), format).length === 4;

export const doesSectionFormatHaveLeadingZeros = (
  adapter: MuiPickersAdapter,
  contentType: FieldSectionContentType,
  sectionType: FieldSectionType,
  format: string,
) => {
  if (contentType !== 'digit') {
    return false;
  }

  const now = adapter.date(undefined, 'default');

  switch (sectionType) {
    // We can't use `changeSectionValueFormat`, because  `adapter.parse('1', 'YYYY')` returns `1971` instead of `1`.
    case 'year': {
      // Remove once https://github.com/iamkun/dayjs/pull/2847 is merged and bump dayjs version
      if (adapter.lib === 'dayjs' && format === 'YY') {
        return true;
      }
      return adapter.formatByString(adapter.setYear(now, 1), format).startsWith('0');
    }

    case 'month': {
      return adapter.formatByString(adapter.startOfYear(now), format).length > 1;
    }

    case 'day': {
      return adapter.formatByString(adapter.startOfMonth(now), format).length > 1;
    }

    case 'weekDay': {
      return adapter.formatByString(adapter.startOfWeek(now), format).length > 1;
    }

    case 'hours': {
      return adapter.formatByString(adapter.setHours(now, 1), format).length > 1;
    }

    case 'minutes': {
      return adapter.formatByString(adapter.setMinutes(now, 1), format).length > 1;
    }

    case 'seconds': {
      return adapter.formatByString(adapter.setSeconds(now, 1), format).length > 1;
    }

    default: {
      throw new Error('Invalid section type');
    }
  }
};

/**
 * Some date libraries like `dayjs` don't support parsing from date with escaped characters.
 * To make sure that the parsing works, we are building a format and a date without any separator.
 */
export const getDateFromDateSections = (
  adapter: MuiPickersAdapter,
  sections: FieldSection[],
  localizedDigits: string[],
): PickerValidDate => {
  // If we have both a day and a weekDay section,
  // Then we skip the weekDay in the parsing because libraries like dayjs can't parse complicated formats containing a weekDay.
  // dayjs(dayjs().format('dddd MMMM D YYYY'), 'dddd MMMM D YYYY')) // returns `Invalid Date` even if the format is valid.
  const shouldSkipWeekDays = sections.some((section) => section.type === 'day');

  const sectionFormats: string[] = [];
  const sectionValues: string[] = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];

    const shouldSkip = shouldSkipWeekDays && section.type === 'weekDay';
    if (!shouldSkip) {
      sectionFormats.push(section.format);
      sectionValues.push(getSectionVisibleValue(section, 'non-input', localizedDigits));
    }
  }

  const formatWithoutSeparator = sectionFormats.join(' ');
  const dateWithoutSeparatorStr = sectionValues.join(' ');

  return adapter.parse(dateWithoutSeparatorStr, formatWithoutSeparator)!;
};

export const createDateStrForV7HiddenInputFromSections = (sections: FieldSection[]) =>
  sections
    .map((section) => {
      return `${section.startSeparator}${section.value || section.placeholder}${
        section.endSeparator
      }`;
    })
    .join('');

export const createDateStrForV6InputFromSections = (
  sections: FieldSection[],
  localizedDigits: string[],
  isRtl: boolean,
) => {
  const formattedSections = sections.map((section) => {
    const dateValue = getSectionVisibleValue(
      section,
      isRtl ? 'input-rtl' : 'input-ltr',
      localizedDigits,
    );

    return `${section.startSeparator}${dateValue}${section.endSeparator}`;
  });

  const dateStr = formattedSections.join('');

  if (!isRtl) {
    return dateStr;
  }

  // \u2066: start left-to-right isolation
  // \u2067: start right-to-left isolation
  // \u2068: start first strong character isolation
  // \u2069: pop isolation
  // wrap into an isolated group such that separators can split the string in smaller ones by adding \u2069\u2068
  return `\u2066${dateStr}\u2069`;
};

export const getSectionsBoundaries = (
  adapter: MuiPickersAdapter,
  localizedDigits: string[],
  timezone: PickersTimezone,
): FieldSectionsValueBoundaries => {
  const today = adapter.date(undefined, timezone);
  const endOfYear = adapter.endOfYear(today);
  const endOfDay = adapter.endOfDay(today);

  const { maxDaysInMonth, longestMonth } = getMonthsInYear(adapter, today).reduce(
    (acc, month) => {
      const daysInMonth = adapter.getDaysInMonth(month);

      if (daysInMonth > acc.maxDaysInMonth) {
        return { maxDaysInMonth: daysInMonth, longestMonth: month };
      }

      return acc;
    },
    { maxDaysInMonth: 0, longestMonth: null as PickerValidDate | null },
  );

  return {
    year: ({ format }) => ({
      minimum: 0,
      maximum: isFourDigitYearFormat(adapter, format) ? 9999 : 99,
    }),
    month: () => ({
      minimum: 1,
      // Assumption: All years have the same amount of months
      maximum: adapter.getMonth(endOfYear) + 1,
    }),
    day: ({ currentDate }) => ({
      minimum: 1,
      maximum: adapter.isValid(currentDate) ? adapter.getDaysInMonth(currentDate) : maxDaysInMonth,
      longestMonth: longestMonth!,
    }),
    weekDay: ({ format, contentType }) => {
      if (contentType === 'digit') {
        const daysInWeek = getDaysInWeekStr(adapter, format).map(Number);
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
      const lastHourInDay = adapter.getHours(endOfDay);
      const hasMeridiem =
        removeLocalizedDigits(
          adapter.formatByString(adapter.endOfDay(today), format),
          localizedDigits,
        ) !== lastHourInDay.toString();

      if (hasMeridiem) {
        return {
          minimum: 1,
          maximum: Number(
            removeLocalizedDigits(
              adapter.formatByString(adapter.startOfDay(today), format),
              localizedDigits,
            ),
          ),
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
      maximum: adapter.getMinutes(endOfDay),
    }),
    seconds: () => ({
      minimum: 0,
      // Assumption: All years have the same amount of seconds
      maximum: adapter.getSeconds(endOfDay),
    }),
    meridiem: () => ({
      minimum: 0,
      maximum: 1,
    }),
    empty: () => ({
      minimum: 0,
      maximum: 0,
    }),
  };
};

let warnedOnceInvalidSection = false;

export const validateSections = <TValue extends PickerValidValue>(
  sections: InferFieldSection<TValue>[],
  valueType: PickerValueType,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceInvalidSection) {
      const supportedSections: FieldSectionType[] = ['empty'];
      if (['date', 'date-time'].includes(valueType)) {
        supportedSections.push('weekDay', 'day', 'month', 'year');
      }
      if (['time', 'date-time'].includes(valueType)) {
        supportedSections.push('hours', 'minutes', 'seconds', 'meridiem');
      }

      const invalidSection = sections.find((section) => !supportedSections.includes(section.type));

      if (invalidSection) {
        console.warn(
          `MUI X: The field component you are using is not compatible with the "${invalidSection.type}" date section.`,
          `The supported date sections are ["${supportedSections.join('", "')}"]\`.`,
        );
        warnedOnceInvalidSection = true;
      }
    }
  }
};

const transferDateSectionValue = (
  adapter: MuiPickersAdapter,
  section: FieldSection,
  dateToTransferFrom: PickerValidDate,
  dateToTransferTo: PickerValidDate,
) => {
  switch (section.type) {
    case 'year': {
      return adapter.setYear(dateToTransferTo, adapter.getYear(dateToTransferFrom));
    }

    case 'month': {
      return adapter.setMonth(dateToTransferTo, adapter.getMonth(dateToTransferFrom));
    }

    case 'weekDay': {
      let dayInWeekStrOfActiveDate = adapter.formatByString(dateToTransferFrom, section.format);
      if (section.hasLeadingZerosInInput) {
        dayInWeekStrOfActiveDate = cleanLeadingZeros(dayInWeekStrOfActiveDate, section.maxLength!);
      }

      const formattedDaysInWeek = getDaysInWeekStr(adapter, section.format);
      const dayInWeekOfActiveDate = formattedDaysInWeek.indexOf(dayInWeekStrOfActiveDate);
      const dayInWeekOfNewSectionValue = formattedDaysInWeek.indexOf(section.value);
      const diff = dayInWeekOfNewSectionValue - dayInWeekOfActiveDate;
      return adapter.addDays(dateToTransferFrom, diff);
    }

    case 'day': {
      return adapter.setDate(dateToTransferTo, adapter.getDate(dateToTransferFrom));
    }

    case 'meridiem': {
      const isAM = adapter.getHours(dateToTransferFrom) < 12;
      const mergedDateHours = adapter.getHours(dateToTransferTo);

      if (isAM && mergedDateHours >= 12) {
        return adapter.addHours(dateToTransferTo, -12);
      }

      if (!isAM && mergedDateHours < 12) {
        return adapter.addHours(dateToTransferTo, 12);
      }

      return dateToTransferTo;
    }

    case 'hours': {
      return adapter.setHours(dateToTransferTo, adapter.getHours(dateToTransferFrom));
    }

    case 'minutes': {
      return adapter.setMinutes(dateToTransferTo, adapter.getMinutes(dateToTransferFrom));
    }

    case 'seconds': {
      return adapter.setSeconds(dateToTransferTo, adapter.getSeconds(dateToTransferFrom));
    }

    default: {
      return dateToTransferTo;
    }
  }
};

const reliableSectionModificationOrder: Record<FieldSectionType, number> = {
  year: 1,
  month: 2,
  day: 3,
  weekDay: 4,
  hours: 5,
  minutes: 6,
  seconds: 7,
  meridiem: 8,
  empty: 9,
};

export const mergeDateIntoReferenceDate = (
  adapter: MuiPickersAdapter,
  dateToTransferFrom: PickerValidDate,
  sections: FieldSection[],
  referenceDate: PickerValidDate,
  shouldLimitToEditedSections: boolean,
): PickerValidDate =>
  // cloning sections before sort to avoid mutating it
  [...sections]
    .sort(
      (a, b) => reliableSectionModificationOrder[a.type] - reliableSectionModificationOrder[b.type],
    )
    .reduce((mergedDate, section) => {
      if (!shouldLimitToEditedSections || section.modified) {
        return transferDateSectionValue(adapter, section, dateToTransferFrom, mergedDate);
      }

      return mergedDate;
    }, referenceDate);

export const isAndroid = () => navigator.userAgent.toLowerCase().includes('android');

// TODO v9: Remove
export const getSectionOrder = (
  sections: FieldSection[],
  shouldApplyRTL: boolean,
): SectionOrdering => {
  const neighbors: SectionNeighbors = {};
  if (!shouldApplyRTL) {
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
      (section, index) =>
        index >= groupedSectionsStart &&
        section.endSeparator?.includes(' ') &&
        // Special case where the spaces were not there in the initial input
        section.endSeparator !== ' / ',
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

export const parseSelectedSections = (
  selectedSections: FieldSelectedSections,
  sections: FieldSection[],
): FieldParsedSelectedSections => {
  if (selectedSections == null) {
    return null;
  }

  if (selectedSections === 'all') {
    return 'all';
  }

  if (typeof selectedSections === 'string') {
    const index = sections.findIndex((section) => section.type === selectedSections);
    return index === -1 ? null : index;
  }

  return selectedSections;
};
