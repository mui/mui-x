import type { PickerValueManager } from '../hooks/usePicker';
import type { DateValidationError } from '../hooks/validation/useDateValidation';
import type { TimeValidationError } from '../hooks/validation/useTimeValidation';
import type { DateTimeValidationError } from '../hooks/validation/useDateTimeValidation';
import type { FieldSection, FieldValueManager } from '../hooks/useField';
import { replaceInvalidDateByNull } from './date-utils';
import {
  addPositionPropertiesToSections,
  createDateStrForInputFromSections,
  splitFormatIntoSections,
  getSectionOrder,
} from '../hooks/useField/useField.utils';

export type SingleItemPickerValueManager<
  TValue = any,
  TDate = any,
  TError extends DateValidationError | TimeValidationError | DateTimeValidationError = any,
> = PickerValueManager<TValue, TDate, TError>;

export const singleItemValueManager: SingleItemPickerValueManager = {
  emptyValue: null,
  getTodayValue: (utils) => utils.date()!,
  cleanValue: replaceInvalidDateByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b),
  isSameError: (a, b) => a === b,
  defaultErrorState: null,
};

export const singleItemFieldValueManager: FieldValueManager<
  any,
  any,
  FieldSection,
  DateValidationError | TimeValidationError | DateTimeValidationError
> = {
  updateReferenceValue: (utils, value, prevReferenceValue) =>
    value == null || !utils.isValid(value) ? prevReferenceValue : value,
  getSectionsFromValue: (utils, localeText, prevSections, date, format) =>
    addPositionPropertiesToSections(splitFormatIntoSections(utils, localeText, format, date)),
  getValueStrFromSections: (sections) => createDateStrForInputFromSections(sections),
  getActiveDateSections: (sections) => sections,
  getActiveDateManager: (utils, state) => ({
    activeDate: state.value,
    referenceActiveDate: state.referenceValue,
    getNewValueFromNewActiveDate: (newActiveDate) => {
      return {
        value: newActiveDate,
        referenceValue:
          newActiveDate == null || !utils.isValid(newActiveDate)
            ? state.referenceValue
            : newActiveDate,
      };
    },
  }),
  parseValueStr: (valueStr, referenceValue, parseDate) =>
    parseDate(valueStr.trim(), referenceValue),
  hasError: (error) => error != null,
  getSectionOrder: (utils, localeText, format, isRTL) =>
    getSectionOrder(splitFormatIntoSections(utils, localeText, format, null), isRTL),
};
