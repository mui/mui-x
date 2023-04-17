import { useUtils, useField } from '@mui/x-date-pickers/internals';
import {
  UseSingleInputTimeRangeFieldDefaultizedProps,
  UseSingleInputTimeRangeFieldParams,
  UseSingleInputTimeRangeFieldProps,
} from './SingleInputTimeRangeField.types';
import { rangeValueManager, rangeFieldValueManager } from '../internal/utils/valueManagers';
import { validateTimeRange } from '../internal/hooks/validation/useTimeRangeValidation';

export const useDefaultizedTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseSingleInputTimeRangeFieldProps<TDate>,
): UseSingleInputTimeRangeFieldDefaultizedProps<TDate, AdditionalProps> => {
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

export const useSingleInputTimeRangeField = <TDate, TChildProps extends {}>({
  props,
  inputRef,
}: UseSingleInputTimeRangeFieldParams<TDate, TChildProps>) => {
  const {
    value,
    defaultValue,
    format,
    formatDensity,
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
    unstableFieldRef,
    ...other
  } = useDefaultizedTimeRangeFieldProps<TDate, TChildProps>(props);

  return useField({
    inputRef,
    forwardedProps: other as Omit<TChildProps, keyof UseSingleInputTimeRangeFieldProps<TDate>>,
    internalProps: {
      value,
      defaultValue,
      format,
      formatDensity,
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
      unstableFieldRef,
    },
    valueManager: rangeValueManager,
    fieldValueManager: rangeFieldValueManager,
    validator: validateTimeRange,
    valueType: 'time',
  });
};
