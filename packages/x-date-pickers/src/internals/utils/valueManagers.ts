import { PickerStateValueManager } from '../hooks/usePickerState';
import { DateValidationError } from '../hooks/validation/useDateValidation';
import { TimeValidationError } from '../hooks/validation/useTimeValidation';
import { DateTimeValidationError } from '../hooks/validation/useDateTimeValidation';
import { replaceInvalidDateByNull } from './date-utils';
import {
  addPositionPropertiesToSections,
  createDateStrFromSections,
  FieldSection,
  FieldValueManager,
  splitFormatIntoSections,
} from '@mui/x-date-pickers/internals/hooks/useField';

export const singleItemValueManager: PickerStateValueManager<
  any,
  any,
  DateValidationError | TimeValidationError | DateTimeValidationError
> = {
  emptyValue: null,
  getTodayValue: (utils) => utils.date()!,
  cleanValue: replaceInvalidDateByNull,
  areValuesEqual: (utils, a, b) => utils.isEqual(a, b),
  isSameError: (a, b) => a === b,
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
  getValueStrFromSections: (sections) => createDateStrFromSections(sections, true),
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
};
