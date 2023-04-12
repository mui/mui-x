import {
  singleItemFieldValueManager,
  singleItemValueManager,
} from '../internals/utils/valueManagers';
import { useField } from '../internals/hooks/useField';
import {
  UseTimeFieldProps,
  UseTimeFieldDefaultizedProps,
  UseTimeFieldParams,
} from './TimeField.types';
import { validateTime } from '../internals/hooks/validation/useTimeValidation';
import { useUtils } from '../internals/hooks/useUtils';

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
    formatDensity,
    onChange,
    readOnly,
    onError,
    disableFuture,
    disablePast,
    minTime,
    maxTime,
    minutesStep,
    shouldDisableClock,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation,
    selectedSections,
    onSelectedSectionsChange,
    ampm,
    unstableFieldRef,
    ...other
  } = useDefaultizedTimeField<TDate, TChildProps>(props);

  return useField({
    inputRef,
    forwardedProps: other as Omit<TChildProps, keyof UseTimeFieldProps<TDate>>,
    internalProps: {
      value,
      defaultValue,
      format,
      formatDensity,
      onChange,
      readOnly,
      onError,
      disableFuture,
      disablePast,
      minTime,
      maxTime,
      minutesStep,
      shouldDisableClock,
      shouldDisableTime,
      disableIgnoringDatePartForTimeValidation,
      selectedSections,
      onSelectedSectionsChange,
      ampm,
      unstableFieldRef,
    },
    valueManager: singleItemValueManager,
    fieldValueManager: singleItemFieldValueManager,
    validator: validateTime,
    valueType: 'time',
  });
};
