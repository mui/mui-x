import * as React from 'react';
import { FieldSection, PickerOwnerState } from '../../../models';
import { UsePickerValueResponse } from './usePickerValue.types';
import { PickersContextValue } from '../../components/PickersProvider';

interface UsePickerContextValueParameters<TValue> {
  pickerValueResponse: UsePickerValueResponse<TValue, FieldSection, any>;
  ownerState: PickerOwnerState<TValue>;
}

export function usePickerContextValue<TValue>(
  parameters: UsePickerContextValueParameters<TValue>,
): PickersContextValue<TValue> {
  const { pickerValueResponse, ownerState } = parameters;

  return React.useMemo<PickersContextValue<TValue>>(
    () => ({
      onOpen: pickerValueResponse.actions.onOpen,
      onClose: pickerValueResponse.actions.onClose,
      open: pickerValueResponse.open,
      ownerState,
    }),
    [
      pickerValueResponse.actions.onOpen,
      pickerValueResponse.actions.onClose,
      pickerValueResponse.open,
      ownerState,
    ],
  );
}
