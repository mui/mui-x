import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useTimeField as useTimeField,
  UseTimeFieldComponentProps,
} from '@mui/x-date-pickers/TimeField';
import {
  TimeValidationError,
  useLocalizationContext,
  useUtils,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models/range';
import {
  TimeRangeValidationError,
  TimeRangeComponentValidationProps,
  validateTimeRange,
} from '../validation/useTimeRangeValidation';
import type {
  UseMultiInputTimeRangeFieldDefaultizedProps,
  UseMultiInputTimeRangeFieldParams,
  UseMultiInputTimeRangeFieldProps,
} from '../../../MultiInputTimeRangeField/MultiInputTimeRangeField.types';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';

export const useDefaultizedTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseMultiInputTimeRangeFieldProps<TDate>,
): UseMultiInputTimeRangeFieldDefaultizedProps<TDate, AdditionalProps> => {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();
  const defaultFormat = ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h;

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? defaultFormat,
    minTime: props.minTime,
    maxTime: props.maxTime,
  } as any;
};

export const useMultiInputTimeRangeField = <TDate, TChildProps extends {}>({
  sharedProps: inSharedProps,
  startInputProps: inStartInputProps,
  endInputProps: inEndInputProps,
  startInputRef,
  endInputRef,
}: UseMultiInputTimeRangeFieldParams<
  TDate,
  TChildProps
>): UseMultiInputRangeFieldResponse<TChildProps> => {
  const sharedProps = useDefaultizedTimeRangeFieldProps<TDate, TChildProps>(inSharedProps);
  const adapter = useLocalizationContext<TDate>();

  const { value: valueProp, defaultValue, format, onChange } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<TDate | null, TimeValidationError> => {
    if (!onChange) {
      return () => {};
    }

    return (newDate, rawContext) => {
      const currentDateRange =
        valueProp ?? firstDefaultValue.current ?? rangeValueManager.emptyValue;
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, currentDateRange[1]] : [currentDateRange[0], newDate];

      const context: FieldChangeHandlerContext<TimeRangeValidationError> = {
        ...rawContext,
        validationError: validateTimeRange({
          adapter,
          value: newDateRange,
          props: { ...sharedProps, value: newDateRange },
        }),
      };

      onChange(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const startInputProps: UseTimeFieldComponentProps<TDate, TChildProps> = {
    ...inStartInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endInputProps: UseTimeFieldComponentProps<TDate, TChildProps> = {
    ...inEndInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const rawStartDateResponse = useTimeField<TDate, TChildProps>({
    props: startInputProps,
    inputRef: startInputRef,
  });
  const rawEndDateResponse = useTimeField<TDate, TChildProps>({
    props: endInputProps,
    inputRef: endInputRef,
  });

  const value = valueProp ?? firstDefaultValue.current ?? rangeValueManager.emptyValue;

  const validationError = useValidation<
    DateRange<TDate>,
    TDate,
    TimeRangeValidationError,
    TimeRangeComponentValidationProps
  >(
    { ...sharedProps, value },
    validateTimeRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const startDateResponse = {
    ...rawStartDateResponse,
    error: !!validationError[0],
  };

  const endDateResponse = {
    ...rawEndDateResponse,
    error: !!validationError[1],
  };

  return { startDate: startDateResponse, endDate: endDateResponse };
};
