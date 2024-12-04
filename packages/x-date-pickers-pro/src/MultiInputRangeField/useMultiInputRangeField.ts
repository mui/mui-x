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
import { useValidation } from '@mui/x-date-pickers/validation';
import { useMultiInputRangeFieldTextFieldProps } from './useMultiInputRangeFieldTextFieldProps';
import { useMultiInputRangeFieldSelectedSections } from './useMultiInputRangeFieldSelectedSections';

/**
 * Basic example:
 *
 * ```tsx
 * import Box from '@mui/material/Box';
 * import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
 * import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
 * import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
 *
 * function MultiInputField(props) {
 *   const manager = useDateRangeManager();
 *   const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
 *   const { startDate, endDate } = useMultiInputRangeField({
 *     internalProps,
 *     startForwardedProps: forwardedProps,
 *     endForwardedProps: forwardedProps,
 *   });
 *
 *   return (
 *     <Box {...forwardedProps}>
 *       <PickersTextField {...startDate} />
 *       <span>{' – '}</span>
 *       <PickersTextField {...endDate} />
 *     </Box>
 *   );
 * }
 * ```
 *
 * @param {UseMultiInputRangeFieldParameters<TManager, TForwardedProps>} parameters The parameters of the hook.
 * @param {TManager} parameters.manager The manager of the field.
 * @param {PickerManagerFieldInternalProps<TManager>} parameters.internalProps The internal props of the field.
 * @param {TForwardedProps} parameters.startForwardedProps The forwarded props of the start field.
 * @param {TForwardedProps} parameters.endForwardedProps The forwarded props of the end field.
 * @returns {{ startDate: Omit<UseFieldResponse<TEnableAccessibleFieldDOMStructure, TForwardedProps>, 'clearable' | 'onClear'>, endDate: Omit<UseFieldResponse<TEnableAccessibleFieldDOMStructure, TForwardedProps>, 'clearable' | 'onClear'> }} The props to pass to the start and the end components.
 */
export function useMultiInputRangeField<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends {},
>(parameters: UseMultiInputRangeFieldParameters<TManager, TForwardedProps>) {
  type TError = PickerManagerError<TManager>;

  const { manager, internalProps, startForwardedProps, endForwardedProps } = parameters;

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
    unstableStartFieldRef,
    unstableEndFieldRef,
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

  return {
    startDate: startDateProps,
    endDate: endDateProps,
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
}
