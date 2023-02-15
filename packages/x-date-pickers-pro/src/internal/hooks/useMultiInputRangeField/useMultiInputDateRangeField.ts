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
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';
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

export const useMultiInputDateRangeField = <TDate, TTextFieldProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  startInputRef,
  unstableStartFieldRef,
  endTextFieldProps,
  endInputRef,
  unstableEndFieldRef,
}: UseMultiInputDateRangeFieldParams<TDate, TTextFieldProps>): UseMultiInputRangeFieldResponse<
  TTextFieldProps & UseDateFieldProps<TDate>
> => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TDate, UseDateFieldProps<TDate>>(
    inSharedProps,
  );
  const adapter = useLocalizationContext<TDate>();

  const {
    value: valueProp,
    defaultValue,
    format,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
  } = sharedProps;

  const firstDefaultValue = React.useRef(defaultValue);

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<TDate | null, DateValidationError> => {
    if (!onChange) {
      return () => {};
    }

    return (newDate, rawContext) => {
      const currentDateRange =
        valueProp ?? firstDefaultValue.current ?? rangeValueManager.emptyValue;
      const newDateRange: DateRange<TDate> =
        index === 0 ? [newDate, currentDateRange[1]] : [currentDateRange[0], newDate];

      const context: FieldChangeHandlerContext<DateRangeValidationError> = {
        ...rawContext,
        validationError: validateDateRange({
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

  const startFieldProps: UseDateFieldComponentProps<TDate, TTextFieldProps> = {
    ...startTextFieldProps,
    disabled,
    readOnly,
    format,
    unstableFieldRef: unstableStartFieldRef,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
    selectedSections,
    onSelectedSectionsChange,
  };

  const endFieldProps: UseDateFieldComponentProps<TDate, TTextFieldProps> = {
    ...endTextFieldProps,
    format,
    disabled,
    readOnly,
    unstableFieldRef: unstableEndFieldRef,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
    selectedSections,
    onSelectedSectionsChange,
  };

  const rawStartDateResponse = useDateField({
    props: startFieldProps,
    inputRef: startInputRef,
  }) as UseFieldResponse<TTextFieldProps>;

  const rawEndDateResponse = useDateField({
    props: endFieldProps,
    inputRef: endInputRef,
  }) as UseFieldResponse<TTextFieldProps>;

  const value = valueProp ?? firstDefaultValue.current ?? rangeValueManager.emptyValue;

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
