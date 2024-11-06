'use client';
import * as React from 'react';
import { PickerContext, PickerPrivateContextValue } from '../components/PickerProvider';

/**
 * Returns the private context passed by the picker that wraps the current component.
 */
export const usePickerPrivateContext = () => {
  const value = React.useContext(PickerContext) as PickerPrivateContextValue | null;
  if (value == null) {
    throw new Error(
      'MUI X: The `usePickerPrivateContext` can only be called in components that are used inside a picker component.',
    );
  }

  return value;
};
