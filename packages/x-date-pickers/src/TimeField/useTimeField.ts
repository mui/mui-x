import { timePickerValueManager } from '../TimePicker/shared';
import { useField, FieldValueManager, FieldSection } from '../internals/hooks/useField';
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
import { dateFieldValueManager } from '../DateField/useDateField';

const timeFieldValueManager: FieldValueManager<any, any, FieldSection, TimeValidationError> = {
  ...dateFieldValueManager,
  hasError: (error) => error != null,
  isSameError: isSameTimeError,
};

const useDefaultizedTimeField = <TDate, AdditionalProps extends {}>(
  props: UseTimeFieldProps<TDate>,
): AdditionalProps & UseTimeFieldDefaultizedProps<TDate> => {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
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
    ampm,
    ...other
  } = useDefaultizedTimeField<TDate, TChildProps>(props);

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
      disableFuture,
      disablePast,
      minTime,
      maxTime,
      minutesStep,
      shouldDisableTime,
      disableIgnoringDatePartForTimeValidation,
      selectedSections,
      onSelectedSectionsChange,
      ampm,
    },
    valueManager: timePickerValueManager,
    fieldValueManager: timeFieldValueManager,
    validator: validateTime,
    supportedDateSections: ['hour', 'minute', 'second', 'meridiem'],
  });
};
