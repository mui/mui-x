import * as React from 'react';
import { FieldSection, PickerOwnerState } from '../../../models';
import type { UsePickerProps } from './usePicker.types';
import { PickerValueManager, UsePickerValueResponse } from './usePickerValue.types';
import { useUtils } from '../useUtils';

interface UsePickerOwnerStateParameters<TValue> {
  props: UsePickerProps<TValue, any, any, any, any, any>;
  pickerValueResponse: UsePickerValueResponse<TValue, FieldSection, any>;
  valueManager: PickerValueManager<TValue, any, any>;
}

export function usePickerOwnerState<TValue>(
  parameters: UsePickerOwnerStateParameters<TValue>,
): PickerOwnerState {
  const { props, pickerValueResponse, valueManager } = parameters;

  const utils = useUtils();

  return React.useMemo(
    () => ({
      isPickerValueEmpty: valueManager.areValuesEqual(
        utils,
        pickerValueResponse.viewProps.value,
        valueManager.emptyValue,
      ),
      isPickerOpen: pickerValueResponse.open,
      isPickerDisabled: props.disabled ?? false,
      isPickerReadOnly: props.readOnly ?? false,
    }),
    [
      utils,
      valueManager,
      pickerValueResponse.viewProps.value,
      pickerValueResponse.open,
      props.disabled,
      props.readOnly,
    ],
  );
}
