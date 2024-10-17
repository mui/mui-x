import * as React from 'react';
import { FieldSection, PickerOwnerState } from '../../../models';
import type { UsePickerProps } from './usePicker.types';
import { UsePickerValueResponse } from './usePickerValue.types';

interface UsePickerOwnerStateParameters<TValue> {
  props: UsePickerProps<TValue, any, any, any, any, any>;
  pickerValueResponse: UsePickerValueResponse<TValue, FieldSection, any>;
}

export function usePickerOwnerState<TValue>(
  parameters: UsePickerOwnerStateParameters<TValue>,
): PickerOwnerState<TValue> {
  const { props, pickerValueResponse } = parameters;

  return React.useMemo(
    () => ({
      value: pickerValueResponse.viewProps.value,
      open: pickerValueResponse.open,
      disabled: props.disabled ?? false,
      readOnly: props.readOnly ?? false,
    }),
    [pickerValueResponse.viewProps.value, pickerValueResponse.open, props.disabled, props.readOnly],
  );
}
