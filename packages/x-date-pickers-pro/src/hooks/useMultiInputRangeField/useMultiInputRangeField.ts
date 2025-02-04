'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  FieldChangeHandler,
  FieldChangeHandlerContext,
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerError,
  PickerManagerFieldInternalProps,
  PickerRangeValue,
  PickerValue,
  useControlledValueWithTimezone,
  useFieldInternalPropsWithDefaults,
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';
import { useValidation } from '@mui/x-date-pickers/validation';
import { useMultiInputRangeFieldTextFieldProps } from './useMultiInputRangeFieldTextFieldProps';
import { useMultiInputRangeFieldSelectedSections } from './useMultiInputRangeFieldSelectedSections';
import { PickerAnyRangeManager } from '../../internals/models/managers';
import {
  useMultiInputRangeFieldRootProps,
  UseMultiInputRangeFieldRootPropsReturnValue,
} from './useMultiInputRangeFieldRootProps';

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
 *     manager,
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
 * @param {UseMultiInputRangeFieldParameters<TManager, TTextFieldProps>} parameters The parameters of the hook.
 * @param {TManager} parameters.manager The manager of the field.
 * @param {PickerManagerFieldInternalProps<TManager>} parameters.internalProps The internal props of the field.
 * @param {TTextFieldProps} parameters.startForwardedProps The forwarded props of the start field.
 * @param {TTextFieldProps} parameters.endForwardedProps The forwarded props of the end field.
 * @returns {UseMultiInputRangeFieldReturnValue<TManager, TTextFieldProps>} The props to pass to the start and the end components.
 */
export function useMultiInputRangeField<
  TManager extends PickerAnyRangeManager,
  TTextFieldProps extends { [key: string]: any },
  TRootProps extends { [key: string]: any },
>(
  parameters: UseMultiInputRangeFieldParameters<TManager, TTextFieldProps, TRootProps>,
): UseMultiInputRangeFieldReturnValue<TManager, TTextFieldProps, TRootProps> {
  type TError = PickerManagerError<TManager>;

  const { manager, internalProps, rootProps, startTextFieldProps, endTextFieldProps } = parameters;

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
    name: 'useMultiInputRangeField',
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
    return (newSingleValue, rawContext) => {
      const newRange: PickerRangeValue =
        index === 0 ? [newSingleValue, value[1]] : [value[0], newSingleValue];

      const context: FieldChangeHandlerContext<TError> = {
        ...rawContext,
        validationError: getValidationErrorForNewValue(newRange),
      };

      handleValueChange(newRange, context);
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

  const sharedProps = {
    disabled,
    readOnly,
    timezone,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    enableAccessibleFieldDOMStructure,
  };

  const rootResponse = useMultiInputRangeFieldRootProps(rootProps);

  const startTextFieldResponse = useMultiInputRangeFieldTextFieldProps<TManager, TTextFieldProps>({
    valueType: manager.valueType,
    position: 'start',
    fieldProps: {
      error: !!validationError[0],
      ...startTextFieldProps,
      ...selectedSectionsResponse.start,
      ...sharedProps,
      value: valueProp === undefined ? undefined : valueProp[0],
      defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
      onChange: handleStartDateChange,
      autoFocus,
    },
  });

  const endTextFieldResponse = useMultiInputRangeFieldTextFieldProps<TManager, TTextFieldProps>({
    valueType: manager.valueType,
    position: 'end',
    fieldProps: {
      error: !!validationError[1],
      ...endTextFieldProps,
      ...selectedSectionsResponse.end,
      ...sharedProps,
      value: valueProp === undefined ? undefined : valueProp[1],
      defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
      onChange: handleEndDateChange,
      autoFocus: false,
    },
  });

  return {
    root: rootResponse,
    startTextField: startTextFieldResponse,
    endTextField: endTextFieldResponse,
    enableAccessibleFieldDOMStructure,
  };
}

interface UseMultiInputRangeFieldParameters<
  TManager extends PickerAnyRangeManager,
  TTextFieldProps extends { [key: string]: any },
  TRootProps extends { [key: string]: any },
> {
  manager: TManager;
  internalProps: PickerManagerFieldInternalProps<TManager>;
  rootProps: TRootProps;
  startTextFieldProps: TTextFieldProps;
  endTextFieldProps: TTextFieldProps;
}

interface UseMultiInputRangeFieldReturnValue<
  TManager extends PickerAnyRangeManager,
  TTextFieldProps extends { [key: string]: any },
  TRootProps extends { [key: string]: any },
> {
  root: UseMultiInputRangeFieldRootPropsReturnValue<TRootProps>;
  startTextField: Omit<
    UseFieldResponse<PickerManagerEnableAccessibleFieldDOMStructure<TManager>, TTextFieldProps>,
    'clearable' | 'onClear'
  >;
  endTextField: Omit<
    UseFieldResponse<PickerManagerEnableAccessibleFieldDOMStructure<TManager>, TTextFieldProps>,
    'clearable' | 'onClear'
  >;
  enableAccessibleFieldDOMStructure: PickerManagerEnableAccessibleFieldDOMStructure<TManager>;
}
