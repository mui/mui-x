import * as React from 'react';
import { PickerOwnerState } from '../../../models';
import type { UsePickerProps } from './usePicker.types';
import { PickerValueManager, UsePickerValueResponse } from './usePickerValue.types';
import { useUtils } from '../useUtils';

interface UsePickerOwnerStateParameters<TIsRange extends boolean> {
  props: UsePickerProps<TIsRange, any, any, any, any>;
  pickerValueResponse: UsePickerValueResponse<TIsRange, any>;
  valueManager: PickerValueManager<TIsRange, any>;
}

export function usePickerOwnerState<TIsRange extends boolean>(
  parameters: UsePickerOwnerStateParameters<TIsRange>,
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
