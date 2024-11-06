import * as React from 'react';
import { PickerOwnerState } from '../../../models';
import { UsePickerValueResponse } from './usePickerValue.types';
import {
  PickerProviderProps,
  PickerContextValue,
  PickerPrivateContextValue,
} from '../../components/PickerProvider';

export interface UsePickerProviderParameters<TIsRange extends boolean>
  extends Pick<PickerProviderProps, 'localeText'> {
  pickerValueResponse: UsePickerValueResponse<TIsRange, any>;
  ownerState: PickerOwnerState;
}

export interface UsePickerProviderReturnValue extends Omit<PickerProviderProps, 'children'> {}

export function usePickerProvider<TIsRange extends boolean>(
  parameters: UsePickerProviderParameters<TIsRange>,
): UsePickerProviderReturnValue {
  const { pickerValueResponse, ownerState, localeText } = parameters;

  const contextValue = React.useMemo<PickerContextValue>(
    () => ({
      onOpen: pickerValueResponse.actions.onOpen,
      onClose: pickerValueResponse.actions.onClose,
      open: pickerValueResponse.open,
    }),
    [
      pickerValueResponse.actions.onOpen,
      pickerValueResponse.actions.onClose,
      pickerValueResponse.open,
    ],
  );

  const privateContextValue = React.useMemo<PickerPrivateContextValue>(
    () => ({ ownerState }),
    [ownerState],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
  };
}
