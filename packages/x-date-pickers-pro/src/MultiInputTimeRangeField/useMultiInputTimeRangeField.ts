// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import { useUtils } from '@mui/x-date-pickers/internals';
import { timeRangeFieldValueManager } from '../internal/hooks/valueManager/timeRangeValueManager';
import { useMultiInputRangeField } from '../internal/hooks/useMultiInputRangeField';
import {
  UseMultiInputTimeRangeFieldProps,
  UseMultiInputTimeRangeFieldDefaultizedProps,
  UseMultiInputTimeRangeFieldParams,
} from './MultiInputTimeRangeField.types';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import {
  TimeRangeComponentValidationProps,
  TimeRangeValidationError,
  validateTimeRange,
} from '../internal/hooks/validation/useTimeRangeValidation';

export const useDefaultizedDateTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseMultiInputTimeRangeFieldProps<TDate>,
): UseMultiInputTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps => {
  const utils = useUtils<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format: props.format ?? ampm ? utils.formats.fullTime12h : utils.formats.fullTime24h,
    minTime: props.minTime,
    maxTime: props.maxTime,
  } as any;
};

export const useMultiInputTimeRangeField = <TDate, TChildProps extends {}>(
  params: UseMultiInputTimeRangeFieldParams<TDate, TChildProps>,
) => {
  const sharedProps = useDefaultizedDateTimeRangeFieldProps<TDate, TChildProps>(params.sharedProps);

  return useMultiInputRangeField<
    TDate,
    TimeRangeValidationError,
    TimeRangeComponentValidationProps,
    UseMultiInputTimeRangeFieldDefaultizedProps<TDate> & TChildProps,
    TChildProps
  >(
    { ...params, sharedProps },
    validateTimeRange,
    dateRangePickerValueManager,
    timeRangeFieldValueManager,
  );
};
