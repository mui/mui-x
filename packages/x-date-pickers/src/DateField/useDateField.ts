import { datePickerValueManager } from '../DatePicker/shared';
import {
  useField,
  FieldValueManager,
  FieldSection,
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
} from '../internals/hooks/useField';
import { UseDateFieldProps, UseDateFieldDefaultizedProps } from './DateField.interfaces';
import {
  DateValidationError,
  isSameDateError,
  validateDate,
} from '../internals/hooks/validation/useDateValidation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';

const dateRangeFieldValueManager: FieldValueManager<any, any, FieldSection, DateValidationError> = {
  updateReferenceValue: (utils, value, prevReferenceValue) =>
    value == null || !utils.isValid(value) ? prevReferenceValue : value,
  getSectionsFromValue: (utils, prevSections, date, format) =>
    addPositionPropertiesToSections(splitFormatIntoSections(utils, format, date)),
  getValueStrFromSections: (sections) => createDateStrFromSections(sections),
  getActiveDateSections: (sections) => sections,
  getActiveDateManager: (state) => ({
    activeDate: state.value,
    referenceActiveDate: state.referenceValue,
    getNewValueFromNewActiveDate: (newActiveDate) => ({
      value: newActiveDate,
      referenceValue: newActiveDate == null ? state.referenceValue : newActiveDate,
    }),
    setActiveDateAsInvalid: () => null,
  }),
  hasError: (error) => error != null,
  isSameError: isSameDateError,
};

const useDefaultizedDateField = <TDate, AdditionalProps extends {}>(
  props: UseDateFieldProps<TDate>,
): AdditionalProps & UseDateFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return {
    disablePast: false,
    disableFuture: false,
    ...props,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  } as any;
};

export const useDateField = <TDate, TProps extends UseDateFieldProps<TDate>>(inProps: TProps) => {
  const {
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    selectedSectionIndexes,
    onSelectedSectionIndexesChange,
    inputRef,
    ...other
  } = useDefaultizedDateField<TDate, TProps>(inProps);

  return useField({
    forwardedProps: other,
    internalProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSectionIndexes,
      onSelectedSectionIndexesChange,
      inputRef,
    },
    valueManager: datePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
    // TODO: Support time validation.
    validator: validateDate,
  });
};
