import {
  useDateManager,
  UseDateManagerReturnValue,
  useDateTimeManager,
  UseDateTimeManagerReturnValue,
  useTimeManager,
  UseTimeManagerReturnValue,
} from '@mui/x-date-pickers/managers';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickerValueType } from '@mui/x-date-pickers/models';
import {
  PickerAnyManager,
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerFieldInternalProps,
  PickerValue,
  RangePosition,
  useField,
  useFieldInternalPropsWithDefaults,
  UseFieldResponse,
} from '@mui/x-date-pickers/internals';
import { PickerAnyRangeManager } from '../../internals/models/managers';
import { useNullablePickerRangePositionContext } from '../../internals/hooks/useNullablePickerRangePositionContext';
import {
  UseDateRangeManagerReturnValue,
  UseDateTimeRangeManagerReturnValue,
  UseTimeRangeManagerReturnValue,
} from '../../managers';

/**
 * @ignore - internal hook.
 */
export function useMultiInputRangeFieldTextFieldProps<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends { [key: string]: any },
>(parameters: UseMultiInputRangeFieldTextFieldPropsParameters<TManager>) {
  type TEnableAccessibleFieldDOMStructure =
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>;

  const { fieldProps, valueType, position } = parameters;

  let useManager: ({
    enableAccessibleFieldDOMStructure,
  }: {
    enableAccessibleFieldDOMStructure: boolean | undefined;
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
  const rangePositionContext = useNullablePickerRangePositionContext();
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
    skipContextFieldRefAssignment: rangePositionContext?.rangePosition !== position,
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
    // TODO v8: Add a real aria label before moving the opening logic to the field on range pickers.
    getOpenPickerButtonAriaLabel: () => '',
  }) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, TForwardedProps>;

  return fieldResponse;
}

interface UseMultiInputRangeFieldTextFieldPropsParameters<TManager extends PickerAnyRangeManager> {
  valueType: PickerValueType;
  fieldProps: PickerManagerFieldInternalProps<GetDerivedManager<TManager>>;
  position: RangePosition;
}

type GetDerivedManager<TManager extends PickerAnyRangeManager> =
  TManager extends UseDateRangeManagerReturnValue<infer TEnableAccessibleFieldDOMStructure>
    ? UseDateManagerReturnValue<TEnableAccessibleFieldDOMStructure>
    : TManager extends UseTimeRangeManagerReturnValue<infer TEnableAccessibleFieldDOMStructure>
      ? UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
      : TManager extends UseDateTimeRangeManagerReturnValue<
            infer TEnableAccessibleFieldDOMStructure
          >
        ? UseDateTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
        : never;
