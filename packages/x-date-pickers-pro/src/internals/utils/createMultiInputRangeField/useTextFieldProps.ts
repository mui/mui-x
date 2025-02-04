import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickersTextField, PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  PickerFieldUIContext,
  PickerValue,
  RangePosition,
  useNullablePickerContext,
  mergeSlotProps,
} from '@mui/x-date-pickers/internals';
import { FieldOwnerState, FieldRef } from '@mui/x-date-pickers/models';
import { MultiInputRangeFieldSlotProps } from './createMultiInputRangeField.types';
import { useNullablePickerRangePositionContext } from '../../hooks/useNullablePickerRangePositionContext';

export function useTextFieldProps({
  slotProps,
  ownerState,
  position,
}: {
  slotProps: MultiInputRangeFieldSlotProps | undefined;
  ownerState: FieldOwnerState;
  position: 'start' | 'end';
}): PickersTextFieldProps {
  const pickerContext = useNullablePickerContext();
  const translations = usePickerTranslations();
  const rangePositionContext = useNullablePickerRangePositionContext();
  const pickerFieldUIContext = React.useContext(PickerFieldUIContext);
  const rangePosition = rangePositionContext?.rangePosition ?? 'start';
  const setRangePosition = rangePositionContext?.setRangePosition;

  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const previousRangePosition = React.useRef<RangePosition>(rangePosition);

  const openPickerIfPossible = (event: React.UIEvent) => {
    if (!pickerContext) {
      return;
    }

    event.stopPropagation();
    setRangePosition?.(position);
    if (pickerContext.triggerStatus === 'enabled') {
      event.preventDefault();
      pickerContext.setOpen(true);
    }
  };

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      openPickerIfPossible(event);
    }
  });

  // Registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
  // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
  const handleClick = useEventCallback((event: React.MouseEvent) => {
    openPickerIfPossible(event);
  });

  const handleFocus = useEventCallback(() => {
    if (pickerContext?.open) {
      setRangePosition?.(position);
      if (previousRangePosition.current !== position && pickerContext.initialView) {
        pickerContext.setView?.(pickerContext.initialView);
      }
    }
  });

  const textFieldProps: PickersTextFieldProps = useSlotProps({
    elementType: PickersTextField,
    externalSlotProps: mergeSlotProps(
      pickerFieldUIContext.slotProps.textField as any,
      slotProps?.textField as any,
    ),
    additionalProps: {
      onKeyDown: handleKeyDown,
      onClick: handleClick,
      onFocus: handleFocus,
      // TODO: Decide if we also want to set the default labels on standalone fields.
      label: pickerContext ? translations[position] : undefined,
      focused: pickerContext?.open ? rangePosition === position : undefined,
    },
    ownerState: { ...ownerState, position },
  });

  if (!textFieldProps.InputProps) {
    textFieldProps.InputProps = {};
  }

  if (pickerContext && position === 'start') {
    textFieldProps.InputProps.ref = pickerContext.triggerRef;
  }

  React.useEffect(() => {
    if (!pickerContext?.open || pickerContext?.variant === 'mobile') {
      return;
    }

    fieldRef.current?.focusField();
    if (!fieldRef.current || pickerContext.view === pickerContext.initialView) {
      // could happen when the user is switching between the inputs
      previousRangePosition.current = rangePosition;
      return;
    }

    // bring back focus to the field
    fieldRef.current.setSelectedSections(
      // use the current view or `0` when the range position has just been swapped
      previousRangePosition.current === rangePosition ? pickerContext.view : 0,
    );
    previousRangePosition.current = rangePosition;
  }, [
    rangePosition,
    pickerContext?.open,
    pickerContext?.variant,
    pickerContext?.initialView,
    pickerContext?.view,
  ]);

  return textFieldProps;
}
