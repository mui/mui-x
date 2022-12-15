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
import { validateTimeRange } from '../internal/hooks/validation/useTimeRangeValidation';

export const useDefaultizedTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseSingleInputDateTimeRangeFieldProps<TDate>,
): UseSingleInputDateTimeRangeFieldDefaultizedProps<TDate, AdditionalProps> => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
    minDate: applyDefaultDate(utils, props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDate, defaultDates.maxDate),
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
    minTime,
    maxTime,
    minutesStep,
    shouldDisableTime,
    disableFuture,
    disablePast,
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
      minTime,
      maxTime,
      minutesStep,
      shouldDisableTime,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
    },
    valueManager: rangeValueManager,
    fieldValueManager: rangeFieldValueManager,
    validator: validateTimeRange,
    supportedDateSections: ['hours', 'minutes', 'seconds', 'meridiem'],
  });
};
