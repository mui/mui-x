import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  unstable_useDateField as useDateField,
  UseDateFieldComponentProps,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import {
  useLocalizationContext,
  useValidation,
  FieldChangeHandler,
  FieldChangeHandlerContext,
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';
import { DateValidationError } from '@mui/x-date-pickers/models';
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

export const useMultiInputDateRangeField = <TDate, TTextFieldSlotProps extends {}>({
  sharedProps: inSharedProps,
  startTextFieldProps,
  startInputRef,
  unstableStartFieldRef,
  endTextFieldProps,
  endInputRef,
  unstableEndFieldRef,
}: UseMultiInputDateRangeFieldParams<
  TDate,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TTextFieldSlotProps> => {
  const sharedProps = useDefaultizedDateRangeFieldProps<TDate, UseDateFieldProps<TDate>>(
    inSharedProps,
  );
  const adapter = useLocalizationContext<TDate>();

  const {
    value: valueProp,
    defaultValue,
    format,
    formatDensity,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
  } = sharedProps;

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
    DateRangeValidationError,
    DateRangeComponentValidationProps<TDate>
  >(
    { ...sharedProps, value },
    validateDateRange,
    rangeValueManager.isSameError,
    rangeValueManager.defaultErrorState,
  );

  const startFieldProps: UseDateFieldComponentProps<TDate, TTextFieldSlotProps> = {
    error: !!validationError[0],
    ...startTextFieldProps,
    disabled,
    readOnly,
    format,
    formatDensity,
    unstableFieldRef: unstableStartFieldRef,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
    selectedSections,
    onSelectedSectionsChange,
  };

  const endFieldProps: UseDateFieldComponentProps<TDate, TTextFieldSlotProps> = {
    error: !!validationError[1],
    ...endTextFieldProps,
    format,
    formatDensity,
    disabled,
    readOnly,
    unstableFieldRef: unstableEndFieldRef,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
    selectedSections,
    onSelectedSectionsChange,
  };

  const startDateResponse = useDateField({
    props: startFieldProps,
    inputRef: startInputRef,
  }) as UseFieldResponse<TTextFieldSlotProps>;

  const endDateResponse = useDateField({
    props: endFieldProps,
    inputRef: endInputRef,
  }) as UseFieldResponse<TTextFieldSlotProps>;

  return { startDate: startDateResponse, endDate: endDateResponse };
};
