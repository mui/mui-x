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
  UseTimeFieldProps,
  UseTimeFieldDefaultizedProps,
  UseTimeFieldParams,
} from './TimeField.types';
import {
  TimeValidationError,
  isSameTimeError,
  validateTime,
} from '../internals/hooks/validation/useTimeValidation';
import { useUtils } from '../internals/hooks/useUtils';

const dateRangeFieldValueManager: FieldValueManager<any, any, FieldSection, TimeValidationError> = {
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
  isSameError: isSameTimeError,
};

const useDefaultizedTimeField = <TDate, AdditionalProps extends {}>(
  props: UseTimeFieldProps<TDate>,
): AdditionalProps & UseTimeFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();

  return {
    disablePast: false,
    disableFuture: false,
    format: utils.formats.fullTime,
    ...props,
  } as any;
};

export const useTimeField = <TDate, TChildProps extends {}>({
  props,
  inputRef,
}: UseTimeFieldParams<TDate, TChildProps>) => {
  const {
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    disableFuture,
    disablePast,
    minTime,
    maxTime,
    minutesStep,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation,
    selectedSections,
    onSelectedSectionsChange,
    ...other
  } = useDefaultizedTimeField<TDate, TChildProps>(props);

  return useField({
    inputRef,
    forwardedProps: other,
    internalProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      disableFuture,
      disablePast,
      minTime,
      maxTime,
      minutesStep,
      shouldDisableTime,
      disableIgnoringDatePartForTimeValidation,
      selectedSections,
      onSelectedSectionsChange,
      inputRef,
    },
    valueManager: datePickerValueManager,
    fieldValueManager: dateRangeFieldValueManager,
    validator: validateTime,
    supportedDateSections: ['year', 'month', 'day', 'hour', 'minute', 'second', 'am-pm'],
  });
};
