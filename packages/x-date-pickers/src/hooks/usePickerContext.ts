'use client';
import * as React from 'react';
import { PickerContext } from '../internals/components/PickerProvider';

/**
 * Returns the context passed by the picker that wraps the current component.
 */
export const usePickerContext = () => {
  const value = React.useContext(PickerContext);
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickerContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
