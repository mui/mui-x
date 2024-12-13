import * as React from 'react';
import { FieldOwnerState } from '../../models';
import { FormProps } from '../models';
import { usePickerPrivateContext } from './usePickerPrivateContext';

export function useFieldOwnerState(parameters: UseFieldOwnerStateParameters) {
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();

  return React.useMemo<FieldOwnerState>(
    () => ({
      ...pickerOwnerState,
      isFieldDisabled: parameters.disabled ?? false,
      isFieldReadOnly: parameters.readOnly ?? false,
    }),
    [pickerOwnerState, parameters.disabled, parameters.readOnly],
  );
}

interface UseFieldOwnerStateParameters extends FormProps {}
