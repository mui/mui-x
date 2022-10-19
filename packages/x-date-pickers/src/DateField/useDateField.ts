import { datePickerValueManager } from '../DatePicker/shared';
import {
  useField,
  FieldValueManager,
  FieldSection,
  splitFormatIntoSections,
  addPositionPropertiesToSections,
  createDateStrFromSections,
} from '../internals/hooks/useField';
import {
  UseDateFieldProps,
  UseDateFieldDefaultizedProps,
  UseDateFieldParams,
} from './DateField.types';
import {
  DateValidationError,
  isSameDateError,
  validateDate,
} from '../internals/hooks/validation/useDateValidation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';

export const dateFieldValueManager: FieldValueManager<any, any, FieldSection, DateValidationError> =
  {
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
    isSameError: isSameDateError,
  };

const useDefaultizedDateField = <TDate, AdditionalProps extends {}>(
  props: UseDateFieldProps<TDate>,
): AdditionalProps & UseDateFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? utils.formats.keyboardDate,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  } as any;
};

export const useDateField = <TDate, TChildProps extends {}>({
  props,
  inputRef,
}: UseDateFieldParams<TDate, TChildProps>) => {
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
    selectedSections,
    onSelectedSectionsChange,
    ...other
  } = useDefaultizedDateField<TDate, TChildProps>(props);

  return useField({
    inputRef,
    forwardedProps: other as unknown as TChildProps,
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
      selectedSections,
      onSelectedSectionsChange,
    },
    valueManager: datePickerValueManager,
    fieldValueManager: dateFieldValueManager,
    validator: validateDate,
    supportedDateSections: ['year', 'month', 'day'],
  });
};
