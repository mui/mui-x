'use client';
import * as React from 'react';
import { PickersContext, PickersPrivateContextValue } from '../components/PickersProvider';

/**
 * Returns the private context passed by the picker that wraps the current component.
 */
export const usePickersPrivateContext = () => {
  const value = React.useContext(PickersContext) as PickersPrivateContextValue | null;
  if (value == null) {
    throw new Error(
      'MUI X: The `usePickersPrivateContext` can only be called in components that are used inside a picker component.',
    );
  }

  return value;
};
