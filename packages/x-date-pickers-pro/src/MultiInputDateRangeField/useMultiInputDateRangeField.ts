import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import { useUtils } from '@mui/x-date-pickers/internals';
import { UseMultiInputDateRangeFieldProps } from './MultiInputDateRangeField.interfaces';
import { DateRange } from '../internal/models';
import { dateRangePickerValueManager } from '../DateRangePicker/shared';

export const useMultiInputDateRangeField = <TInputDate, TDate>(
  inProps: UseMultiInputDateRangeFieldProps<TInputDate, TDate>,
) => {
  const utils = useUtils<TDate>();

  const { value: valueProp, defaultValue, format, onChange } = inProps;

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

  const startDateResponse = useDateField<TInputDate, TDate, {}>(startInputProps);
  const endDateResponse = useDateField<TInputDate, TDate, {}>(endInputProps);

  return { startDate: startDateResponse, endDate: endDateResponse };
};
