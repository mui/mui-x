import type { PickerValueManager } from '../hooks/usePicker';
import {
  DateValidationError,
  TimeValidationError,
  DateTimeValidationError,
  FieldSection,
} from '../../models';
import type { FieldValueManager } from '../hooks/useField';
import { areDatesEqual, replaceInvalidDateByNull } from './date-utils';
import {
  addPositionPropertiesToSections,
  createDateStrForInputFromSections,
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
  areValuesEqual: areDatesEqual,
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
  getSectionsFromValue: (utils, date, prevSections, getSectionsFromDate) => {
    const shouldReUsePrevDateSections = !utils.isValid(date) && !!prevSections;

    if (shouldReUsePrevDateSections) {
      return prevSections;
    }

    return addPositionPropertiesToSections(getSectionsFromDate(date));
  },
  getValueStrFromSections: (sections) => createDateStrForInputFromSections(sections),
  getActiveDateSections: (sections) => sections,
  getActiveDateManager: (utils, state) => ({
    activeDate: state.value,
    referenceActiveDate: state.referenceValue,
    getNewValueFromNewActiveDate: (newActiveDate) => ({
      value: newActiveDate,
      referenceValue:
        newActiveDate == null || !utils.isValid(newActiveDate)
          ? state.referenceValue
          : newActiveDate,
    }),
  }),
  parseValueStr: (valueStr, referenceValue, parseDate) =>
    parseDate(valueStr.trim(), referenceValue),
  hasError: (error) => error != null,
};
