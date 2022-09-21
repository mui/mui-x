import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
} from '@mui/x-date-pickers/DateField';
import { useUtils, useValidation } from '@mui/x-date-pickers/internals';
import { DateRange } from '../internal/models';
import { validateDateRange } from '../internal/hooks/validation/useDateRangeValidation';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import {
  dateRangeFieldValueManager,
  useDefaultizedDateRangeFieldProps,
} from '../SingleInputDateRangeField/useSingleInputDateRangeField';
import { UseMultiInputDateRangeFieldParams } from './MultiInputDateRangeField.types';

export const useMultiInputDateRangeField = <TInputDate, TDate, TChildProps extends {}>({
  sharedProps: inSharedProps,
  startInputProps: inStartInputProps,
  endInputProps: inEndInputProps,
  startInputRef,
  endInputRef,
}: UseMultiInputDateRangeFieldParams<TInputDate, TDate, TChildProps>) => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TInputDate, TDate, TChildProps>(
    inSharedProps,
  );
  const utils = useUtils<TDate>();

  const { value: valueProp, defaultValue, format, onChange } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (index: 0 | 1) => {
    if (!onChange) {
      return () => {};
    }

    return (newDate: TDate | null) => {
      let newDateRange: DateRange<TDate>;
      if (valueProp !== undefined) {
        newDateRange = dateRangePickerValueManager.parseInput(utils, valueProp);
      } else if (firstDefaultValue.current !== undefined) {
        newDateRange = dateRangePickerValueManager.parseInput(utils, firstDefaultValue.current);
      } else {
        newDateRange = dateRangePickerValueManager.emptyValue;
      }

      newDateRange[index] = newDate;

      onChange(newDateRange);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const startInputProps: UseDateFieldComponentProps<TInputDate, TDate, TChildProps> = {
    ...inStartInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endInputProps: UseDateFieldComponentProps<TInputDate, TDate, TChildProps> = {
    ...inEndInputProps,
    format,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const rawStartDateResponse = useDateField<TInputDate, TDate, TChildProps>({
    props: startInputProps,
    inputRef: startInputRef,
  });
  const rawEndDateResponse = useDateField<TInputDate, TDate, TChildProps>({
    props: endInputProps,
    inputRef: endInputRef,
  });

  // TODO: Avoid the type casting.
  const value =
    valueProp ??
    firstDefaultValue.current ??
    (dateRangePickerValueManager.emptyValue as unknown as DateRange<TInputDate>);

  const validationError = useValidation({ ...sharedProps, value }, validateDateRange, () => true);
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
