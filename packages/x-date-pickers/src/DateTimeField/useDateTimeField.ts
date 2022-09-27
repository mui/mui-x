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
  UseDateTimeFieldProps,
  UseDateTimeFieldDefaultizedProps,
  UseDateTimeFieldParams,
} from './DateTimeField.types';
import {
  DateTimeValidationError,
  isSameDateTimeError,
  validateDateTime,
} from '../internals/hooks/validation/useDateTimeValidation';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { useUtils, useDefaultDates } from '../internals/hooks/useUtils';

const dateRangeFieldValueManager: FieldValueManager<
  any,
  any,
  FieldSection,
  DateTimeValidationError
> = {
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
  isSameError: isSameDateTimeError,
};

const useDefaultizedDateTimeField = <TDate, AdditionalProps extends {}>(
  props: UseDateTimeFieldProps<TDate>,
): AdditionalProps & UseDateTimeFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? utils.formats.keyboardDateTime,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
  } as any;
};

export const useDateTimeField = <TDate, TChildProps extends {}>({
  props,
  inputRef,
}: UseDateTimeFieldParams<TDate, TChildProps>) => {
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
    minTime,
    maxTime,
    minutesStep,
    disableIgnoringDatePartForTimeValidation,
    shouldDisableTime,
    selectedSections,
    onSelectedSectionsChange,
    ...other
  } = useDefaultizedDateTimeField<TDate, TChildProps>(props);

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
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      minDate,
      maxDate,
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
    validator: validateDateTime,
    supportedDateSections: ['year', 'month', 'day', 'hour', 'minute', 'second', 'am-pm'],
  });
};
