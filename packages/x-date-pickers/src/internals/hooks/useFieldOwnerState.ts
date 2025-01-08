import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { FieldOwnerState } from '../../models';
import { FormProps } from '../models';
import { usePickerPrivateContext } from './usePickerPrivateContext';

export function useFieldOwnerState(parameters: UseFieldOwnerStateParameters) {
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const isRtl = useRtl();

  return React.useMemo<FieldOwnerState>(
    () => ({
      ...pickerOwnerState,
      isFieldDisabled: parameters.disabled ?? false,
      isFieldReadOnly: parameters.readOnly ?? false,
      isFieldRequired: parameters.required ?? false,
      fieldDirection: isRtl ? 'rtl' : 'ltr',
    }),
    [pickerOwnerState, parameters.disabled, parameters.readOnly, parameters.required, isRtl],
  );
}

interface UseFieldOwnerStateParameters extends FormProps {
  required?: boolean;
}
