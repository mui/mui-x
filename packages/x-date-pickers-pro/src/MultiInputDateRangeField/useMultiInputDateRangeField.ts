import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import { useUtils, useValidation } from '@mui/x-date-pickers/internals';
import { UseFieldResponse } from '@mui/x-date-pickers/internals-fields';
import { DateRange } from '../internal/models';
import { validateDateRange } from '../internal/hooks/validation/useDateRangeValidation';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';
import {
  dateRangeFieldValueManager,
  useDefaultizedDateRangeFieldProps,
} from '../SingleInputDateRangeField/useSingleInputDateRangeField';
import { UseMultiInputDateRangeFieldParams } from './MultiInputDateRangeField.types';

export const useMultiInputDateRangeField = <TInputDate, TDate, TChildProps extends {}>({
  props: inProps,
  startInputRef,
  endInputRef,
}: UseMultiInputDateRangeFieldParams<TInputDate, TDate, TChildProps>) => {
  const props = useDefaultizedDateRangeFieldProps<TInputDate, TDate, TChildProps>(inProps);
  const utils = useUtils<TDate>();

  const { value: valueProp, defaultValue, format, onChange } = props;

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

  const startInputProps: UseDateFieldProps<TInputDate, TDate> = {
    format,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
  };

  const endInputProps: UseDateFieldProps<TInputDate, TDate> = {
    format,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
  };

  const rawStartDateResponse = useDateField<TInputDate, TDate, {}>({
    props: startInputProps,
    inputRef: startInputRef,
  });
  const rawEndDateResponse = useDateField<TInputDate, TDate, {}>({
    props: endInputProps,
    inputRef: endInputRef,
  });

  // TODO: Avoid the type casting.
  const value =
    valueProp ??
    firstDefaultValue.current ??
    (dateRangePickerValueManager.emptyValue as unknown as DateRange<TInputDate>);

  const validationError = useValidation({ ...props, value }, validateDateRange, () => true);
  const inputError = React.useMemo(
    () => dateRangeFieldValueManager.hasError(validationError),
    [validationError],
  );

  const startDateResponse: UseFieldResponse<{}> = {
    ...rawStartDateResponse,
    error: inputError,
  };

  const endDateResponse: UseFieldResponse<{}> = {
    ...rawEndDateResponse,
    error: inputError,
  };

  return { startDate: startDateResponse, endDate: endDateResponse };
};
