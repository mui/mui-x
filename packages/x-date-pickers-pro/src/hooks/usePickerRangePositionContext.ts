'use client';
import * as React from 'react';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';

export const PickerRangePositionContext = React.createContext<UseRangePositionResponse | null>(
  null,
);

/**
 * Returns information about the range position of the picker that wraps the current component.
 */
export function usePickerRangePositionContext() {
  const value = React.useContext(PickerRangePositionContext);
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickerRangePositionContext` can only be called in components that are used inside a picker component',
      ].join('\n'),
    );
  }

  return value;
}
