import type { PickerValueManager } from '../models';
import { DateValidationError, TimeValidationError, DateTimeValidationError } from '../../models';
import type { FieldValueManager } from '../hooks/useField';
import { areDatesEqual, getTodayDate, replaceInvalidDateByNull } from './date-utils';
import { getDefaultReferenceDate } from './getDefaultReferenceDate';
import {
  createDateStrForV7HiddenInputFromSections,
  createDateStrForV6InputFromSections,
} from '../hooks/useField/useField.utils';
import { PickerValue } from '../models';

export type SingleItemPickerValueManager<
  TError extends DateValidationError | TimeValidationError | DateTimeValidationError = any,
> = PickerValueManager<PickerValue, TError>;

export const singleItemValueManager: SingleItemPickerValueManager = {
  emptyValue: null,
  getTodayValue: getTodayDate,
  getInitialReferenceValue: ({ value, referenceDate, ...params }) => {
    if (params.utils.isValid(value)) {
      return value;
    }

    if (referenceDate != null) {
      return referenceDate;
    }

    return getDefaultReferenceDate(params);
  },
  cleanValue: replaceInvalidDateByNull,
  areValuesEqual: areDatesEqual,
  isSameError: (a, b) => a === b,
  hasError: (error) => error != null,
  defaultErrorState: null,
  getTimezone: (utils, value) => (utils.isValid(value) ? utils.getTimezone(value) : null),
  setTimezone: (utils, timezone, value) =>
    value == null ? null : utils.setTimezone(value, timezone),
};

export const singleItemFieldValueManager: FieldValueManager<PickerValue> = {
  updateReferenceValue: (utils, value, prevReferenceValue) =>
    utils.isValid(value) ? value : prevReferenceValue,
  getSectionsFromValue: (date, getSectionsFromDate) => getSectionsFromDate(date),
  getV7HiddenInputValueFromSections: createDateStrForV7HiddenInputFromSections,
  getV6InputValueFromSections: createDateStrForV6InputFromSections,
  parseValueStr: (valueStr, referenceValue, parseDate) =>
    parseDate(valueStr.trim(), referenceValue),
  getDateFromSection: (value) => value,
  getDateSectionsFromValue: (sections) => sections,
  updateDateInValue: (value, activeSection, activeDate) => activeDate,
  clearDateSections: (sections) => sections.map((section) => ({ ...section, value: '' })),
};
