import {
  PickerValueManager,
  replaceInvalidDateByNull,
  FieldValueManager,
  addPositionPropertiesToSections,
  createDateStrForInputFromSections,
  areDatesEqual,
} from '@mui/x-date-pickers/internals';
import { DateRange, RangePosition } from '../models/range';
import { splitDateRangeSections, removeLastSeparator } from './date-fields-utils';
import type { DateRangeValidationError } from '../hooks/validation/useDateRangeValidation';
import type { TimeRangeValidationError } from '../hooks/validation/useTimeRangeValidation';
import type { DateTimeRangeValidationError } from '../hooks/validation/useDateTimeRangeValidation';
import { RangeFieldSection } from '../models/fields';

export type RangePickerValueManager<
  TValue = [any, any],
  TDate = any,
  TError extends
    | DateRangeValidationError
    | TimeRangeValidationError
    | DateTimeRangeValidationError = any,
> = PickerValueManager<TValue, TDate, TError>;

export const rangeValueManager: RangePickerValueManager = {
  emptyValue: [null, null],
  getTodayValue: (utils, valueType) =>
    valueType === 'date'
      ? [utils.startOfDay(utils.date())!, utils.startOfDay(utils.date())!]
      : [utils.date()!, utils.date()!],
  cleanValue: (utils, value) =>
    value.map((date) => replaceInvalidDateByNull(utils, date)) as DateRange<any>,
  areValuesEqual: (utils, a, b) =>
    areDatesEqual(utils, a[0], b[0]) && areDatesEqual(utils, a[1], b[1]),
  isSameError: (a, b) => b !== null && a[1] === b[1] && a[0] === b[0],
  hasError: (error) => error[0] != null || error[1] != null,
  defaultErrorState: [null, null],
};

export const rangeFieldValueManager: FieldValueManager<DateRange<any>, any, RangeFieldSection> = {
  updateReferenceValue: (utils, value, prevReferenceValue) => {
    const shouldKeepStartDate = value[0] != null && utils.isValid(value[0]);
    const shouldKeepEndDate = value[1] != null && utils.isValid(value[1]);

    if (!shouldKeepStartDate && !shouldKeepEndDate) {
      return prevReferenceValue;
    }

    if (shouldKeepStartDate && shouldKeepEndDate) {
      return value;
    }

    if (shouldKeepStartDate) {
      return [value[0], prevReferenceValue[0]];
    }

    return [prevReferenceValue[1], value[1]];
  },
  getSectionsFromValue: (utils, [start, end], fallbackSections, isRTL, getSectionsFromDate) => {
    const separatedFallbackSections =
      fallbackSections == null
        ? { startDate: null, endDate: null }
        : splitDateRangeSections(fallbackSections);

    const getSections = (
      newDate: any | null,
      fallbackDateSections: RangeFieldSection[] | null,
      position: RangePosition,
    ) => {
      const shouldReUsePrevDateSections = !utils.isValid(newDate) && !!fallbackDateSections;

      if (shouldReUsePrevDateSections) {
        return fallbackDateSections;
      }

      const sections = getSectionsFromDate(newDate);
      return sections.map((section, sectionIndex) => {
        if (sectionIndex === sections.length - 1 && position === 'start') {
          return {
            ...section,
            dateName: position,
            endSeparator: `${section.endSeparator}\u2069 – \u2066`,
          };
        }

        return {
          ...section,
          dateName: position,
        };
      });
    };

    return addPositionPropertiesToSections<RangeFieldSection>(
      [
        ...getSections(start, separatedFallbackSections.startDate, 'start'),
        ...getSections(end, separatedFallbackSections.endDate, 'end'),
      ],
      isRTL,
    );
  },
  getValueStrFromSections: (sections, isRTL) => {
    const dateRangeSections = splitDateRangeSections(sections);
    return createDateStrForInputFromSections(
      [...dateRangeSections.startDate, ...dateRangeSections.endDate],
      isRTL,
    );
  },
  parseValueStr: (valueStr, referenceValue, parseDate) => {
    // TODO: Improve because it would not work if the date format has `–` as a separator.
    const [startStr, endStr] = valueStr.split('–');

    return [startStr, endStr].map((dateStr, index) => {
      if (dateStr == null) {
        return null;
      }

      return parseDate(dateStr.trim(), referenceValue[index]);
    }) as DateRange<any>;
  },
  getActiveDateManager: (utils, state, activeSection) => {
    const index = activeSection.dateName === 'start' ? 0 : 1;

    const updateDateInRange = (newDate: any, prevDateRange: DateRange<any>) =>
      (index === 0 ? [newDate, prevDateRange[1]] : [prevDateRange[0], newDate]) as DateRange<any>;

    return {
      date: state.value[index],
      referenceDate: state.referenceValue[index],
      getSections: (sections) => {
        const dateRangeSections = splitDateRangeSections(sections);
        if (index === 0) {
          return removeLastSeparator(dateRangeSections.startDate);
        }

        return dateRangeSections.endDate;
      },
      getNewValuesFromNewActiveDate: (newActiveDate) => ({
        value: updateDateInRange(newActiveDate, state.value),
        referenceValue:
          newActiveDate == null || !utils.isValid(newActiveDate)
            ? state.referenceValue
            : updateDateInRange(newActiveDate, state.referenceValue),
      }),
    };
  },
};
