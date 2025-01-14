import useEventCallback from '@mui/utils/useEventCallback';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import {
  FieldChangeHandler,
  FieldChangeHandlerContext,
  PickerRangeValue,
  PickerValue,
  UseFieldResponse,
  useControlledValueWithTimezone,
  useFieldInternalPropsWithDefaults,
} from '@mui/x-date-pickers/internals';
import { useValidation } from '@mui/x-date-pickers/validation';
import { DateValidationError } from '@mui/x-date-pickers/models';
import { UseMultiInputDateRangeFieldParams } from '../../../MultiInputDateRangeField/MultiInputDateRangeField.types';
import { validateDateRange } from '../../../validation';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { DateRangeValidationError } from '../../../models';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';
import { useDateRangeManager } from '../../../managers';

export const useMultiInputDateRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
>({
  sharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputDateRangeFieldParams<
  TEnableAccessibleFieldDOMStructure,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps> => {
  const manager = useDateRangeManager(sharedProps);
  const sharedPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps: sharedProps,
  });

  const {
    value: valueProp,
    defaultValue,
    referenceDate,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
    timezone: timezoneProp,
    enableAccessibleFieldDOMStructure,
    autoFocus,
  } = sharedPropsWithDefaults;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'useMultiInputDateRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate,
    onChange,
    valueManager: rangeValueManager,
  });

  const { validationError, getValidationErrorForNewValue } = useValidation({
    props: sharedPropsWithDefaults,
    value,
    timezone,
    validator: validateDateRange,
    onError: sharedPropsWithDefaults.onError,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<PickerValue, DateValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: PickerRangeValue =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<DateRangeValidationError> = {
        ...rawContext,
        validationError: getValidationErrorForNewValue(newDateRange),
      };

      handleValueChange(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const selectedSectionsResponse = useMultiInputFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startFieldProps = {
    error: !!validationError[0],
    ...startTextFieldProps,
    ...selectedSectionsResponse.start,
    disabled,
    readOnly,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[0],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
    onChange: handleStartDateChange,
    enableAccessibleFieldDOMStructure,
    autoFocus, // Do not add on end field.
  };

  const endFieldProps = {
    error: !!validationError[1],
    ...endTextFieldProps,
    ...selectedSectionsResponse.end,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    disabled,
    readOnly,
    timezone,
    value: valueProp === undefined ? undefined : valueProp[1],
    defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
    onChange: handleEndDateChange,
    enableAccessibleFieldDOMStructure,
  };

  const startDateResponse = useDateField<
    TEnableAccessibleFieldDOMStructure,
    typeof startFieldProps
  >(startFieldProps) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps>;

  const endDateResponse = useDateField<TEnableAccessibleFieldDOMStructure, typeof endFieldProps>(
    endFieldProps,
  ) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps>;

  return {
    startDate: startDateResponse,
    endDate: endDateResponse,
  };
};
