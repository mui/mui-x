import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useTimeField as useTimeField,
  UseTimeFieldComponentProps,
  UseTimeFieldProps,
} from '@mui/x-date-pickers/TimeField';
import {
  TimeValidationError,
  useLocalizationContext,
  useUtils,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';
import useControlled from '@mui/utils/useControlled';
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
  } as any;
};

export const useMultiInputTimeRangeField = <TDate, TTextFieldProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  startInputRef,
  unstableStartFieldRef,
  endTextFieldProps,
  endInputRef,
  unstableEndFieldRef,
}: UseMultiInputTimeRangeFieldParams<TDate, TTextFieldProps>): UseMultiInputRangeFieldResponse<
  TTextFieldProps & UseTimeFieldProps<TDate>
> => {
  const sharedProps = useDefaultizedTimeRangeFieldProps<TDate, UseTimeFieldProps<TDate>>(
    inSharedProps,
  );
  const adapter = useLocalizationContext<TDate>();

  const { value: valueProp, defaultValue, format, onChange, disabled, readOnly } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);
  const [value, setValue] = useControlled<DateRange<TDate>>({
    name: 'useMultiInputTimeRangeField',
    state: 'value',
    controlled: valueProp,
    default: firstDefaultValue.current ?? rangeValueManager.emptyValue,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<TDate | null, TimeValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      setValue(newDateRange);

      const context: FieldChangeHandlerContext<TimeRangeValidationError> = {
        ...rawContext,
        validationError: validateTimeRange({
          adapter,
          value: newDateRange,
          props: sharedProps,
        }),
      };

      onChange?.(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

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

  const startFieldProps: UseTimeFieldComponentProps<TDate, TTextFieldProps> = {
    error: !!validationError[0],
    ...startTextFieldProps,
    format,
    disabled,
    readOnly,
    unstableFieldRef: unstableStartFieldRef,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endFieldProps: UseTimeFieldComponentProps<TDate, TTextFieldProps> = {
    error: !!validationError[1],
    ...endTextFieldProps,
    format,
    disabled,
    readOnly,
    unstableFieldRef: unstableEndFieldRef,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const startDateResponse = useTimeField({
    props: startFieldProps,
    inputRef: startInputRef,
  }) as UseFieldResponse<TTextFieldProps>;

  const endDateResponse = useTimeField({
    props: endFieldProps,
    inputRef: endInputRef,
  }) as UseFieldResponse<TTextFieldProps>;

  return { startDate: startDateResponse, endDate: endDateResponse };
};
