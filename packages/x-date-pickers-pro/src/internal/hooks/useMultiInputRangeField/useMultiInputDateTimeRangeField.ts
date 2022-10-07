import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateTimeField as useDateTimeField,
  UseDateTimeFieldComponentProps,
} from '@mui/x-date-pickers/DateTimeField';
import {
  applyDefaultDate,
  useDefaultDates,
  useUtils,
  useValidation,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models/range';
import {
  UseMultiInputDateTimeRangeFieldDefaultizedProps,
  UseMultiInputDateTimeRangeFieldParams,
  UseMultiInputDateTimeRangeFieldProps,
} from '../../../MultiInputDateTimeRangeField/MultiInputDateTimeRangeField.types';
import {
  DateTimeRangeComponentValidationProps,
  DateTimeRangeValidationError,
  validateDateTimeRange,
} from '../validation/useDateTimeRangeValidation';
import { dateRangePickerValueManager } from '../../../DateRangePicker/shared';
import { dateTimeRangeFieldValueManager } from '../valueManager/dateTimeRangeValueManager';

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

export const useMultiInputDateTimeRangeField = <TDate, TChildProps extends {}>({
  sharedProps: inSharedProps,
  startInputProps: inStartInputProps,
  endInputProps: inEndInputProps,
  startInputRef,
  endInputRef,
}: UseMultiInputDateTimeRangeFieldParams<TDate, TChildProps>) => {
  const sharedProps = useDefaultizedDateTimeRangeFieldProps<TDate, TChildProps>(inSharedProps);

  const { value: valueProp, defaultValue, format, onChange } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (index: 0 | 1) => {
    if (!onChange) {
      return () => {};
    }

    return (newDate: TDate | null) => {
      const currentDateRange =
        valueProp ?? firstDefaultValue.current ?? dateRangePickerValueManager.emptyValue;
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, currentDateRange[1]] : [currentDateRange[0], newDate];

      onChange(newDateRange);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const startInputProps: UseDateTimeFieldComponentProps<TDate, TChildProps> = {
    ...inStartInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endInputProps: UseDateTimeFieldComponentProps<TDate, TChildProps> = {
    ...inEndInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const rawStartDateResponse = useDateTimeField<TDate, TChildProps>({
    props: startInputProps,
    inputRef: startInputRef,
  });
  const rawEndDateResponse = useDateTimeField<TDate, TChildProps>({
    props: endInputProps,
    inputRef: endInputRef,
  });

  const value = valueProp ?? firstDefaultValue.current ?? dateRangePickerValueManager.emptyValue;

  const validationError = useValidation<
    DateRange<TDate>,
    TDate,
    DateTimeRangeValidationError,
    DateTimeRangeComponentValidationProps<TDate>
  >({ ...sharedProps, value }, validateDateTimeRange, () => true);
  const inputError = React.useMemo(
    () => dateTimeRangeFieldValueManager.hasError(validationError),
    [validationError],
  );

  const startDateResponse = {
    ...rawStartDateResponse,
    error: inputError,
  };

  const endDateResponse = {
    ...rawEndDateResponse,
    error: inputError,
  };

  return { startDate: startDateResponse, endDate: endDateResponse };
};
