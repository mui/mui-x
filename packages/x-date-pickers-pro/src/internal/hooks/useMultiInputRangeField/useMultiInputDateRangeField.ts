import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
} from '@mui/x-date-pickers/DateField';
import { useValidation } from '@mui/x-date-pickers/internals';
import { useDefaultizedDateRangeFieldProps } from '../../../SingleInputDateRangeField/useSingleInputDateRangeField';
import { UseMultiInputDateRangeFieldParams } from '../../../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { DateRange } from '../../models/range';
import {
  DateRangeComponentValidationProps,
  DateRangeValidationError,
  validateDateRange,
} from '../validation/useDateRangeValidation';
import { dateRangePickerValueManager } from '../../../DateRangePicker/shared';
import { dateRangeFieldValueManager } from '../valueManager/dateRangeValueManager';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';

export const useMultiInputDateRangeField = <TDate, TChildProps extends {}>({
  sharedProps: inSharedProps,
  startInputProps: inStartInputProps,
  endInputProps: inEndInputProps,
  startInputRef,
  endInputRef,
}: UseMultiInputDateRangeFieldParams<
  TDate,
  TChildProps
>): UseMultiInputRangeFieldResponse<TChildProps> => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TDate, TChildProps>(inSharedProps);

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

  const startInputProps: UseDateFieldComponentProps<TDate, TChildProps> = {
    ...inStartInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endInputProps: UseDateFieldComponentProps<TDate, TChildProps> = {
    ...inEndInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const rawStartDateResponse = useDateField<TDate, TChildProps>({
    props: startInputProps,
    inputRef: startInputRef,
  });
  const rawEndDateResponse = useDateField<TDate, TChildProps>({
    props: endInputProps,
    inputRef: endInputRef,
  });

  const value = valueProp ?? firstDefaultValue.current ?? dateRangePickerValueManager.emptyValue;

  const validationError = useValidation<
    DateRange<TDate>,
    TDate,
    DateRangeValidationError,
    DateRangeComponentValidationProps<TDate>
  >({ ...sharedProps, value }, validateDateRange, () => true);
  const inputError = React.useMemo(
    () => dateRangeFieldValueManager.hasError(validationError),
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
