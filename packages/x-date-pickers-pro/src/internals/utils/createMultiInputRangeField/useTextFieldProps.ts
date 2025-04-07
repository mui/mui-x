import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { PickersTextField, PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  PickerFieldUIContext,
  useNullablePickerContext,
  mergeSlotProps,
} from '@mui/x-date-pickers/internals';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import { MultiInputRangeFieldSlotProps } from './createMultiInputRangeField.types';
import { useNullablePickerRangePositionContext } from '../../hooks/useNullablePickerRangePositionContext';

export function useTextFieldProps({
  slotProps,
  ownerState,
  position,
  allowTriggerShifting,
}: {
  slotProps: MultiInputRangeFieldSlotProps | undefined;
  ownerState: FieldOwnerState;
  position: 'start' | 'end';
  allowTriggerShifting?: boolean;
}): PickersTextFieldProps {
  const pickerContext = useNullablePickerContext();
  const translations = usePickerTranslations();
  const pickerFieldUIContext = React.useContext(PickerFieldUIContext);
  const rangePositionContext = useNullablePickerRangePositionContext();

  const textFieldProps: PickersTextFieldProps = useSlotProps({
    elementType: PickersTextField,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.textField as any,
      slotProps?.textField as any,
    ),
    additionalProps: {
      // TODO: Decide if we also want to set the default labels on standalone fields.
      label: pickerContext ? translations[position] : undefined,
      focused: pickerContext?.open ? rangePositionContext?.rangePosition === position : undefined,
    },
    ownerState: { ...ownerState, position },
  });

  if (!textFieldProps.InputProps) {
    textFieldProps.InputProps = {};
  }

  if (pickerContext) {
    if (!allowTriggerShifting) {
      if (position === 'start') {
        textFieldProps.InputProps.ref = pickerContext.triggerRef;
      }
    } else if (rangePositionContext?.rangePosition === position) {
      textFieldProps.InputProps.ref = pickerContext.triggerRef;
    }
  }

  return textFieldProps;
}
