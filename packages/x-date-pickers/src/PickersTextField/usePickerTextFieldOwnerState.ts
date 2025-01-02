'use client';
import * as React from 'react';
import { PickerTextFieldOwnerState } from './PickersTextField.types';

export const PickerTextFieldOwnerStateContext =
  React.createContext<PickerTextFieldOwnerState | null>(null);

export const usePickerTextFieldOwnerState = () => {
  const value = React.useContext(PickerTextFieldOwnerStateContext);
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickerTextFieldOwnerState` can only be called in components that are used inside a PickerTextField component',
      ].join('\n'),
    );
  }

  return value;
};
