import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import {
  DateValidationError,
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
} from '@mui/x-date-pickers/internals';
import useControlled from '@mui/utils/useControlled';
import { useDefaultizedDateRangeFieldProps } from '../../../SingleInputDateRangeField/useSingleInputDateRangeField';
import { UseMultiInputDateRangeFieldParams } from '../../../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { DateRange } from '../../models/range';
import {
  DateRangeComponentValidationProps,
  DateRangeValidationError,
  validateDateRange,
} from '../validation/useDateRangeValidation';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';

export const useMultiInputDateRangeField = <TDate, TChildProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps: inStartTextFieldProps,
  endTextFieldProps: inEndTextFieldProps,
  startInputRef,
  endInputRef,
}: UseMultiInputDateRangeFieldParams<TDate, TChildProps>): UseMultiInputRangeFieldResponse<
  Omit<TChildProps, keyof UseDateFieldProps<TDate>>
> => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TDate, TChildProps>(inSharedProps);
  const adapter = useLocalizationContext<TDate>();

  const { value: valueProp, defaultValue, format, onChange, disabled, readOnly } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);
  const [value, setValue] = useControlled<DateRange<TDate>>({
    name: 'useMultiInputDateRangeField',
    state: 'value',
    controlled: valueProp,
    default: firstDefaultValue.current ?? rangeValueManager.emptyValue,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<TDate | null, DateValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      setValue(newDateRange);

      const context: FieldChangeHandlerContext<DateRangeValidationError> = {
        ...rawContext,
        validationError: validateDateRange({
          adapter,
          value: newDateRange,
          props: { ...sharedProps, value: newDateRange },
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
    DateRangeValidationError,
    DateRangeComponentValidationProps<TDate>
  >(
    { ...sharedProps, value },
    validateDateRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const startInputProps: UseDateFieldComponentProps<TDate, TChildProps> = {
    error: !!validationError[0],
    ...inStartTextFieldProps,
    disabled,
    readOnly,
    format,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endInputProps: UseDateFieldComponentProps<TDate, TChildProps> = {
    error: !!validationError[1],
    ...inEndTextFieldProps,
    format,
    disabled,
    readOnly,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const startDateResponse = useDateField<TDate, TChildProps>({
    props: startInputProps,
    inputRef: startInputRef,
  });
  const endDateResponse = useDateField<TDate, TChildProps>({
    props: endInputProps,
    inputRef: endInputRef,
  });

  return { startDate: startDateResponse, endDate: endDateResponse };
};
