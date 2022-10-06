// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import { applyDefaultDate, useDefaultDates, useUtils } from '@mui/x-date-pickers/internals';
import { dateTimeRangeFieldValueManager } from '../internal/hooks/valueManager/dateTimeRangeValueManager';
import { useMultiInputRangeField } from '../internal/hooks/useMultiInputRangeField';
import {
  UseMultiInputDateTimeRangeFieldProps,
  UseMultiInputDateTimeRangeFieldDefaultizedProps,
  UseMultiInputDateTimeRangeFieldParams,
} from './MultiInputDateTimeRangeField.types';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import {
  DateTimeRangeComponentValidationProps,
  DateTimeRangeValidationError,
  validateDateTimeRange,
} from '../internal/hooks/validation/useDateTimeRangeValidation';

export const useDefaultizedDateTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseMultiInputDateTimeRangeFieldProps<TDate>,
): UseMultiInputDateTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps => {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  const ampm = props.ampm ?? utils.is12HourCycleInCurrentLocale();

  return {
    ...props,
    disablePast: props.disablePast ?? false,
    disableFuture: props.disableFuture ?? false,
    format:
      props.format ?? ampm ? utils.formats.keyboardDateTime12h : utils.formats.keyboardDateTime24h,
    minDate: applyDefaultDate(utils, props.minDateTime ?? props.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, props.maxDateTime ?? props.maxDate, defaultDates.maxDate),
    minTime: props.minDateTime ?? props.minTime,
    maxTime: props.maxDateTime ?? props.maxTime,
    disableIgnoringDatePartForTimeValidation: Boolean(props.minDateTime || props.maxDateTime),
  } as any;
};

export const useMultiInputDateTimeRangeField = <TDate, TChildProps extends {}>(
  params: UseMultiInputDateTimeRangeFieldParams<TDate, TChildProps>,
) => {
  const sharedProps = useDefaultizedDateTimeRangeFieldProps<TDate, TChildProps>(params.sharedProps);

  return useMultiInputRangeField<
    TDate,
    DateTimeRangeValidationError,
    DateTimeRangeComponentValidationProps<TDate>,
    UseMultiInputDateTimeRangeFieldDefaultizedProps<TDate> & TChildProps,
    TChildProps
  >(
    { ...params, sharedProps },
    validateDateTimeRange,
    dateRangePickerValueManager,
    dateTimeRangeFieldValueManager,
  );
};
