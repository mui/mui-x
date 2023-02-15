import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateTimeField as useDateTimeField,
  UseDateTimeFieldComponentProps,
  UseDateTimeFieldProps,
} from '@mui/x-date-pickers/DateTimeField';
import {
  applyDefaultDate,
  DateTimeValidationError,
  useDefaultDates,
  useLocalizationContext,
  useUtils,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models/range';
import type {
  UseMultiInputDateTimeRangeFieldDefaultizedProps,
  UseMultiInputDateTimeRangeFieldParams,
  UseMultiInputDateTimeRangeFieldProps,
} from '../../../MultiInputDateTimeRangeField/MultiInputDateTimeRangeField.types';
import {
  DateTimeRangeComponentValidationProps,
  DateTimeRangeValidationError,
  validateDateTimeRange,
} from '../validation/useDateTimeRangeValidation';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';

export const useDefaultizedDateTimeRangeFieldProps = <TDate, AdditionalProps extends {}>(
  props: UseMultiInputDateTimeRangeFieldProps<TDate>,
): UseMultiInputDateTimeRangeFieldDefaultizedProps<TDate, AdditionalProps> => {
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

export const useMultiInputDateTimeRangeField = <TDate, TTextFieldProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  startInputRef,
  unstableStartFieldRef,
  endTextFieldProps,
  endInputRef,
  unstableEndFieldRef,
}: UseMultiInputDateTimeRangeFieldParams<TDate, TTextFieldProps>): UseMultiInputRangeFieldResponse<
  TTextFieldProps & UseDateTimeFieldProps<TDate>
> => {
  const sharedProps = useDefaultizedDateTimeRangeFieldProps<TDate, UseDateTimeFieldProps<TDate>>(
    inSharedProps,
  );
  const adapter = useLocalizationContext<TDate>();

  const { value: valueProp, defaultValue, format, onChange, disabled, readOnly } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<TDate | null, DateTimeValidationError> => {
    if (!onChange) {
      return () => {};
    }

    return (newDate, rawContext) => {
      const currentDateRange =
        valueProp ?? firstDefaultValue.current ?? rangeValueManager.emptyValue;
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, currentDateRange[1]] : [currentDateRange[0], newDate];

      const context: FieldChangeHandlerContext<DateTimeRangeValidationError> = {
        ...rawContext,
        validationError: validateDateTimeRange({
          adapter,
          value: newDateRange,
          props: sharedProps,
        }),
      };

      onChange(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const startFieldProps: UseDateTimeFieldComponentProps<TDate, TTextFieldProps> = {
    ...startTextFieldProps,
    format,
    disabled,
    readOnly,
    unstableFieldRef: unstableStartFieldRef,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endFieldProps: UseDateTimeFieldComponentProps<TDate, TTextFieldProps> = {
    ...endTextFieldProps,
    format,
    disabled,
    readOnly,
    unstableFieldRef: unstableEndFieldRef,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const rawStartDateResponse = useDateTimeField({
    props: startFieldProps,
    inputRef: startInputRef,
  }) as UseFieldResponse<TTextFieldProps>;

  const rawEndDateResponse = useDateTimeField({
    props: endFieldProps,
    inputRef: endInputRef,
  }) as UseFieldResponse<TTextFieldProps>;

  const value = valueProp ?? firstDefaultValue.current ?? rangeValueManager.emptyValue;

  const validationError = useValidation<
    DateRange<TDate>,
    TDate,
    DateTimeRangeValidationError,
    DateTimeRangeComponentValidationProps<TDate>
  >(
    { ...sharedProps, value },
    validateDateTimeRange,
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
