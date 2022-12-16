import {
  useUtils,
  useField,
  applyDefaultDate,
  useDefaultDates,
} from '@mui/x-date-pickers/internals';
import {
  UseSingleInputDateTimeRangeFieldDefaultizedProps,
  UseSingleInputDateTimeRangeFieldParams,
  UseSingleInputDateTimeRangeFieldProps,
} from './SingleInputDateTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internal/utils/valueManagers';
import { validateDateTimeRange } from '../internal/hooks/validation/useDateTimeRangeValidation';

export const useDefaultizedTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseSingleInputDateTimeRangeFieldProps<TDate>,
): UseSingleInputDateTimeRangeFieldDefaultizedProps<TDate, AdditionalProps> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm
    ? utils.formats.keyboardDateTime12h
    : utils.formats.keyboardDateTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
    minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
    minTime: props.minDateTime ?? props.minTime,
    maxTime: props.maxDateTime ?? props.maxTime,
    disableIgnoringDatePartForTimeValidation: Boolean(props.minDateTime || props.maxDateTime),
  } as any;
};

export const useSingleInputDateTimeRangeField = <TDate, TChildProps extends {}>({
  props,
  inputRef,
}: UseSingleInputDateTimeRangeFieldParams<TDate, TChildProps>) => {
  const {
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    minTime,
    maxTime,
    minDateTime,
    maxDateTime,
    minutesStep,
    shouldDisableTime,
    disableIgnoringDatePartForTimeValidation,
    selectedSections,
    onSelectedSectionsChange,
    ...other
  } = useDefaultizedTimeRangeFieldProps<TDate, TChildProps>(props);

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
    },
    valueManager: rangeValueManager,
    fieldValueManager: rangeFieldValueManager,
    validator: validateDateTimeRange,
    supportedDateSections: ['hours', 'minutes', 'seconds', 'meridiem'],
  });
};
