import * as React from 'react';
import { PickerOwnerState } from '../../../models';
import { UsePickerValueResponse } from './usePickerValue.types';
import {
  PickersProviderProps,
  PickersContextValue,
  PickersPrivateContextValue,
} from '../../components/PickersProvider';

export interface UsePickerProviderParameters<TIsRange extends boolean>
  extends Pick<PickersProviderProps, 'localeText'> {
  pickerValueResponse: UsePickerValueResponse<TIsRange, any>;
  ownerState: PickerOwnerState;
}

export interface UsePickerProviderReturnValue extends Omit<PickersProviderProps, 'children'> {}

export function usePickerProvider<TIsRange extends boolean>(
  parameters: UsePickerProviderParameters<TIsRange>,
): UsePickerProviderReturnValue {
  const { pickerValueResponse, ownerState, localeText } = parameters;

  const contextValue = React.useMemo<PickersContextValue>(
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

  const privateContextValue = React.useMemo<PickersPrivateContextValue>(
    () => ({ ownerState }),
    [ownerState],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
  };
}
