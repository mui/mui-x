import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
} from '@mui/x-date-pickers/DateField';
import { FieldValueManager, UseFieldInternalProps } from '@mui/x-date-pickers/internals-fields';
import {
  MakeOptional,
  PickerStateValueManager,
  useValidation,
  Validator,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../models';
import { DateRangeFieldSection } from '../models/dateRange';

export interface UseMultiInputRangeFieldParams<TParentProps extends {}, TChildProps extends {}> {
  sharedProps: Omit<TChildProps, keyof TParentProps> & TParentProps;
  startInputProps: TChildProps;
  endInputProps: TChildProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  endInputRef?: React.Ref<HTMLInputElement>;
}

export const useMultiInputRangeField = <
  TDate,
  ValidationError,
  ValidationProps extends {},
  TParentProps extends ValidationProps &
    MakeOptional<UseFieldInternalProps<DateRange<TDate>, ValidationError>, 'format'>,
  TChildProps extends {},
>(
  {
    sharedProps,
    startInputProps: inStartInputProps,
    endInputProps: inEndInputProps,
    startInputRef,
    endInputRef,
  }: UseMultiInputRangeFieldParams<TParentProps, TChildProps>,
  validateRange: Validator<DateRange<TDate>, TDate, ValidationError, ValidationProps>,
  dateRangePickerValueManager: PickerStateValueManager<[any, any], any>,
  dateRangeFieldValueManager: FieldValueManager<
    DateRange<any>,
    any,
    DateRangeFieldSection,
    ValidationError
  >,
) => {
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

  const validationError = useValidation<DateRange<TDate>, TDate, ValidationError, ValidationProps>(
    { ...sharedProps, value },
    validateRange,
    () => true,
  );
  const inputError = React.useMemo(
    () => dateRangeFieldValueManager.hasError(validationError),
    [dateRangeFieldValueManager, validationError],
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
