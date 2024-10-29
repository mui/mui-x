'use client';
import * as React from 'react';
import { PickersPrivateContext, PickersPrivateContextValue } from '../components/PickersProvider';

/**
 * Returns the private context passed by the picker that wraps the current component.
 */
export const usePickersPrivateContext = () => {
  const value = React.useContext(PickersPrivateContext) as PickersPrivateContextValue | null;
  if (value == null) {
    throw new Error(
      'MUI X: The `usePickersPrivateContext` can only be called in components that are used inside a picker component.',
    );
  }

  return value;
};
