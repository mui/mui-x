'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  FieldChangeHandler,
  FieldChangeHandlerContext,
  PickerAnyRangeManager,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  PickerRangeValue,
  PickerValue,
  useControlledValueWithTimezone,
  useFieldInternalPropsWithDefaults,
} from '@mui/x-date-pickers/internals';
import { FieldRef } from '@mui/x-date-pickers/models';
import { useValidation } from '@mui/x-date-pickers/validation';
import { useMultiInputRangeFieldTextFieldProps } from './useMultiInputRangeFieldTextFieldProps';
import { useMultiInputRangeFieldSelectedSections } from './useMultiInputRangeFieldSelectedSections';

export function useMultiInputRangeField<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends {},
>(parameters: UseMultiInputRangeFieldParameters<TManager, TForwardedProps>) {
  type TError = PickerManagerError<TManager>;

  const {
    manager,
    internalProps,
    startForwardedProps,
    endForwardedProps,
    unstableStartFieldRef,
    unstableEndFieldRef,
  } = parameters;

  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
  });

  const {
    value: valueProp,
    defaultValue,
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
    referenceDate,
  } = internalPropsWithDefaults;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'useMultiInputDateRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate,
    onChange,
    valueManager: manager.internal_valueManager,
  });

  const { validationError, getValidationErrorForNewValue } = useValidation({
    props: internalPropsWithDefaults,
    value,
    timezone,
    validator: manager.validator,
    onError: internalPropsWithDefaults.onError,
  });

  const buildChangeHandler = (index: 0 | 1): FieldChangeHandler<PickerValue, unknown> => {
    return (newDate, rawContext) => {
      const newDateRange: PickerRangeValue =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<TError> = {
        ...rawContext,
        validationError: getValidationErrorForNewValue(newDateRange),
      };

      handleValueChange(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const selectedSectionsResponse = useMultiInputRangeFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startDateProps = useMultiInputRangeFieldTextFieldProps({
    valueType: manager.valueType,
    fieldProps: {
      error: !!validationError[0],
      ...startForwardedProps,
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
    },
  });

  const endDateProps = useMultiInputRangeFieldTextFieldProps({
    valueType: manager.valueType,
    fieldProps: {
      error: !!validationError[1],
      ...endForwardedProps,
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
    },
  });

  console.log(internalPropsWithDefaults);

  return {
    startDate: startDateProps,
    endDate: endDateProps,
    dateSeparator: internalPropsWithDefaults.dateSeparator,
  };
}

interface UseMultiInputRangeFieldParameters<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends {},
> {
  manager: TManager;
  internalProps: PickerManagerFieldInternalProps<TManager>;
  startForwardedProps: TForwardedProps;
  endForwardedProps: TForwardedProps;
  unstableStartFieldRef: React.Ref<FieldRef<PickerValue>> | undefined;
  unstableEndFieldRef: React.Ref<FieldRef<PickerValue>> | undefined;
}
