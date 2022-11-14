import { FieldSection, AvailableAdjustKeyCode, FieldBoundaries } from './useField.interfaces';
import { MuiPickerFieldAdapter, MuiDateSectionName } from '../../models';
import { PickersLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export const getDateSectionConfigFromFormatToken = <TDate>(
  utils: MuiPickerFieldAdapter<TDate>,
  formatToken: string,
): Pick<FieldSection, 'dateSectionName' | 'contentType'> => {
  const config = utils.formatTokenMap[formatToken];

  if (config == null) {
    throw new Error(`getDatePartNameFromFormat doesn't understand the format ${formatToken}`);
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

export const adjustDateSectionValue = <TDate>(
  utils: MuiPickerFieldAdapter<TDate>,
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
  utils: MuiPickerFieldAdapter<TDate>,
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
  section: Omit<FieldSection, 'start' | 'end'>,
  willBeRenderedInInput: boolean,
) => {
  const value = section.value || section.placeholder;

  // In the input, we add an empty character at the end of each section without trailing zeros.
  // This make sure that `onChange` will always be fired.
  // Otherwise, when your input value equals `1/dd/yyyy` (format `M/DD/YYYY` on DayJs),
  // If you press `1`, on the first section, the new value is also `1/dd/yyyy`,
  // So the browser will not fire the input `onChange`.
  if (willBeRenderedInInput && section.contentType === 'digit' && !section.hasTrailingZeroes) {
    return `${value}‎`;
  }

  return value;
};

export const addPositionPropertiesToSections = <TSection extends FieldSection>(
  sections: Omit<TSection, 'start' | 'end'>[],
): TSection[] => {
  let position = 0;
  const newSections: TSection[] = [];

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const end =
      position + getSectionVisibleValue(section, true).length + (section.separator?.length ?? 0);

    newSections.push({ ...section, start: position, end } as TSection);
    position = end;
  }

  return newSections;
};

const getSectionPlaceholder = <TDate>(
  utils: MuiPickerFieldAdapter<TDate>,
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

export const splitFormatIntoSections = <TDate>(
  utils: MuiPickerFieldAdapter<TDate>,
  localeText: PickersLocaleText<TDate>,
  format: string,
  date: TDate | null,
) => {
  let currentTokenValue = '';
  const sections: Omit<FieldSection, 'start' | 'end'>[] = [];
  const expandedFormat = utils.expandFormat(format);

  const commitCurrentToken = () => {
    if (currentTokenValue === '') {
      return;
    }

    const sectionConfig = getDateSectionConfigFromFormatToken(utils, currentTokenValue);
    const sectionValue = date == null ? '' : utils.formatByString(date, currentTokenValue);

    const hasTrailingZeroes =
      sectionConfig.contentType === 'digit' &&
      utils.formatByString(utils.parse('1', currentTokenValue)!, currentTokenValue).length > 1;

    sections.push({
      ...sectionConfig,
      formatValue: currentTokenValue,
      value: sectionValue,
      placeholder: getSectionPlaceholder(utils, localeText, sectionConfig, currentTokenValue),
      hasTrailingZeroes,
      separator: '',
      edited: false,
    });

    currentTokenValue = '';
  };

  for (let i = 0; i < expandedFormat.length; i += 1) {
    const char = expandedFormat[i];

    if (char.match(/([A-zÀ-ú]+)/g)) {
      currentTokenValue += char;
    } else {
      commitCurrentToken();
      sections[sections.length - 1].separator += char;
    }
  }

  commitCurrentToken();

  return sections.map((section) => {
    if (section.separator !== '/') {
      return section;
    }
    return {
      ...section,
      separator: ' / ',
      parsingSeparator: '/',
    };
  });
};

export const createDateStrFromSections = (
  sections: FieldSection[],
  willBeRenderedInInput: boolean,
) =>
  sections
    .map((section) => {
      let sectionValueStr = getSectionVisibleValue(section, willBeRenderedInInput);

      const separator = willBeRenderedInInput
        ? section.separator
        : section.parsingSeparator ?? section.separator;

      if (separator != null) {
        sectionValueStr += separator;
      }

      return sectionValueStr;
    })
    .join('');

export const getMonthsMatchingQuery = <TDate, TSection extends FieldSection>(
  utils: MuiPickerFieldAdapter<TDate>,
  section: TSection,
  query: string,
) => {
  switch (section.dateSectionName) {
    case 'month': {
      const monthList = utils
        .getMonthArray(utils.date()!)
        .map((month) => utils.formatByString(month, section.formatValue));
      return monthList.filter((month) => month.toLowerCase().startsWith(query));
    }

    case 'meridiem': {
      const now = utils.date()!;
      return [utils.endOfDay(now), utils.startOfDay(now)]
        .map((date) => utils.formatByString(date, section.formatValue))
        .filter((meridiem) => meridiem.toLowerCase().startsWith(query));
    }

    default: {
      throw new Error(
        `MUI: The section ${section.dateSectionName} does not support letter edition`,
      );
    }
  }
};

export const getSectionBoundaries = <TDate, TSection extends FieldSection>(
  utils: MuiPickerFieldAdapter<TDate>,
): FieldBoundaries<TDate, TSection> => {
  const today = utils.date()!;

  const endOfYear = utils.endOfYear(today);

  const maxDaysInMonth = utils.getMonthArray(today).reduce((acc, month) => {
    const daysInMonth = utils.getDaysInMonth(month);
    return Math.max(acc, daysInMonth);
  }, 0);

  return {
    year: (currentDate, section) => ({
      minimum: 1,
      maximum: utils.formatByString(today, section.formatValue).length === 4 ? 9999 : 99,
    }),
    month: () => ({
      minimum: 1,
      // Assumption: All years have the same amount of months
      maximum: utils.getMonth(endOfYear) + 1,
    }),
    day: (currentDate) => ({
      minimum: 1,
      maximum:
        currentDate != null && utils.isValid(currentDate)
          ? utils.getDaysInMonth(currentDate)
          : maxDaysInMonth,
    }),
    hours: () => ({
      minimum: 0,
      // Assumption: All days have the same amount of hours
      maximum: utils.getHours(endOfYear),
    }),
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

export const applySectionValueToDate = <TDate>({
  utils,
  dateSectionName,
  date,
  getNumericSectionValue,
  getMeridiemSectionValue,
}: {
  utils: MuiPickerFieldAdapter<TDate>;
  dateSectionName: MuiDateSectionName;
  date: TDate;
  getNumericSectionValue: (getter: (date: TDate) => number) => number;
  getMeridiemSectionValue: () => string;
}) => {
  if (dateSectionName === 'meridiem') {
    const isAM = getMeridiemSectionValue().toLowerCase() === 'am';
    const hours = utils.getHours(date);

    if (isAM && hours >= 12) {
      return utils.addHours(date, -12);
    }

    if (!isAM && hours < 12) {
      return utils.addHours(date, 12);
    }

    return date;
  }

  const adapterMethods = {
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

  const methods = adapterMethods[dateSectionName as keyof typeof adapterMethods];

  if (!methods) {
    throw new Error(`MUI: The section name ${dateSectionName} can't be applied to a date`);
  }

  return methods.setter(date, getNumericSectionValue(methods.getter));
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

let warnedOnceInvalidSection = false;

export const validateSections = <TSection extends FieldSection>(
  sections: TSection[],
  supportedSections: MuiDateSectionName[],
) => {
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
  TSection extends Omit<FieldSection, 'start' | 'end'>,
>(
  utils: MuiPickerFieldAdapter<TDate>,
  date: TDate,
  sections: TSection[],
  referenceDate: TDate,
  shouldLimitToEditedSections: boolean,
) => {
  let mergedDate = referenceDate;

  sections.forEach((section) => {
    if (!shouldLimitToEditedSections || section.edited) {
      mergedDate = applySectionValueToDate({
        utils,
        date: mergedDate,
        dateSectionName: section.dateSectionName,
        getNumericSectionValue: (getter) => getter(date),
        getMeridiemSectionValue: () => (utils.getHours(mergedDate) < 12 ? 'AM' : 'PM'),
      });
    }
  });

  return mergedDate;
};

export const isAndroid = () => navigator.userAgent.toLowerCase().indexOf('android') > -1;

export const clampDaySection = <TDate, TSection extends FieldSection>(
  utils: MuiPickerFieldAdapter<TDate>,
  sections: TSection[],
  boundaries: FieldBoundaries<TDate, TSection>,
  format: string,
) => {
  // We try to generate a valid date representing the start of the month of the invalid date typed by the user.
  const sectionsForStartOfMonth = sections.map((section) => {
    if (section.dateSectionName !== 'day') {
      return section;
    }

    const dayBoundaries = boundaries.day(null, section);

    return {
      ...section,
      value: section.hasTrailingZeroes
        ? cleanTrailingZeroInNumericSectionValue(
            dayBoundaries.minimum.toString(),
            dayBoundaries.maximum,
          )
        : dayBoundaries.minimum.toString(),
    };
  });

  const startOfMonth = utils.parse(
    createDateStrFromSections(sectionsForStartOfMonth, false),
    format,
  );

  // Even the start of the month is invalid, we probably have other invalid sections, the clamping failed.
  if (startOfMonth == null || !utils.isValid(startOfMonth)) {
    return null;
  }

  // The only invalid section was the day of the month, we replace its value with the maximum boundary for the correct month.
  return sections.map((section) => {
    if (section.dateSectionName !== 'day') {
      return section;
    }

    const dayBoundaries = boundaries.day(startOfMonth, section);
    if (Number(section.value) <= dayBoundaries.maximum) {
      return section;
    }

    return {
      ...section,
      value: dayBoundaries.maximum.toString(),
    };
  });
};
