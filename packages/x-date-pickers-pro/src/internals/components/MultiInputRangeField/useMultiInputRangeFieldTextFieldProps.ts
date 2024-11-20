import { TextFieldProps } from '@mui/material/TextField';
import {
  PickerValueType,
  useDateManager,
  useDateTimeManager,
  useTimeManager,
} from '@mui/x-date-pickers';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import {
  convertFieldResponseIntoMuiTextFieldProps,
  PickerAnyRangeManager,
  PickerAnyManager,
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerFieldInternalProps,
  PickerValue,
  useField,
  useFieldInternalPropsWithDefaults,
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';

export function useMultiInputRangeFieldTextFieldProps<TManager extends PickerAnyRangeManager>(
  parameters: UseMultiInputRangeFieldTextFieldProps<TManager>,
): TextFieldProps {
  type TEnableAccessibleFieldDOMStructure =
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>;

  const { fieldProps, valueType } = parameters;

  let useManager: ({
    enableAccessibleFieldDOMStructure,
  }: {
    enableAccessibleFieldDOMStructure: boolean;
  }) => PickerAnyManager;
  switch (valueType) {
    case 'date': {
      useManager = useDateManager;
      break;
    }
    case 'time': {
      useManager = useTimeManager;
      break;
    }
    case 'date-time': {
      useManager = useDateTimeManager;
      break;
    }
    default: {
      throw new Error(`Unknown valueType: ${valueType}`);
    }
  }

  const manager = useManager({
    enableAccessibleFieldDOMStructure: fieldProps.enableAccessibleFieldDOMStructure,
  });

  const { forwardedProps, internalProps } = useSplitFieldProps(fieldProps, 'date');
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
  });

  const { clearable, onClear, ...fieldResponse } = useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalPropsWithDefaults
  >({
    forwardedProps,
    internalProps: internalPropsWithDefaults,
    valueManager: manager.internal_valueManager,
    fieldValueManager: manager.internal_fieldValueManager,
    validator: manager.validator,
    valueType: manager.valueType,
  }) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TextFieldProps>;

  return convertFieldResponseIntoMuiTextFieldProps(fieldResponse as any);
}

interface UseMultiInputRangeFieldTextFieldProps<TManager extends PickerAnyRangeManager> {
  valueType: PickerValueType;
  fieldProps: PickerManagerFieldInternalProps<TManager>;
}
