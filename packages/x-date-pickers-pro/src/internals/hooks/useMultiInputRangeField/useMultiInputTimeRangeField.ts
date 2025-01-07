import useEventCallback from '@mui/utils/useEventCallback';
import { unstable_useTimeField as useTimeField } from '@mui/x-date-pickers/TimeField';
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
import { TimeValidationError } from '@mui/x-date-pickers/models';
import { UseMultiInputTimeRangeFieldParams } from '../../../MultiInputTimeRangeField/MultiInputTimeRangeField.types';
import { validateTimeRange } from '../../../validation';
import { rangeValueManager } from '../../utils/valueManagers';
import type { UseMultiInputRangeFieldResponse } from './useMultiInputRangeField.types';
import { TimeRangeValidationError } from '../../../models';
import { excludeProps } from './shared';
import { useMultiInputFieldSelectedSections } from '../useMultiInputFieldSelectedSections';
import { useTimeRangeManager } from '../../../managers';

export const useMultiInputTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
>({
  sharedProps,
  startTextFieldProps,
  unstableStartFieldRef,
  endTextFieldProps,
  unstableEndFieldRef,
}: UseMultiInputTimeRangeFieldParams<
  TEnableAccessibleFieldDOMStructure,
  TTextFieldSlotProps
>): UseMultiInputRangeFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps> => {
  const manager = useTimeRangeManager(sharedProps);
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
    name: 'useMultiInputTimeRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: rangeValueManager,
    referenceDate,
  });

  const { validationError, getValidationErrorForNewValue } = useValidation({
    props: sharedPropsWithDefaults,
    value,
    timezone,
    validator: validateTimeRange,
    onError: sharedPropsWithDefaults.onError,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (
    index: 0 | 1,
  ): FieldChangeHandler<PickerValue, TimeValidationError> => {
    return (newDate, rawContext) => {
      const newDateRange: PickerRangeValue =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<TimeRangeValidationError> = {
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

  const startDateResponse = useTimeField<
    TEnableAccessibleFieldDOMStructure,
    typeof startFieldProps
  >(startFieldProps) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps>;

  const endDateResponse = useTimeField<TEnableAccessibleFieldDOMStructure, typeof endFieldProps>(
    endFieldProps,
  ) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TTextFieldSlotProps>;

  /* TODO: Undo this change when a clearable behavior for multiple input range fields is implemented */
  return {
    startDate: excludeProps(startDateResponse, ['clearable', 'onClear']),
    endDate: excludeProps(endDateResponse, ['clearable', 'onClear']),
  };
};
