'use client';
import * as React from 'react';
import { PickersContext, PickersContextValue } from '../internals/components/PickersProvider';

/**
 * Returns the context passed by the picker that wraps the current component.
 */
export const usePickersContext = <
  // TODO v8: Replace with TIsRange when available
  TValue = any,
>() => {
  const value = React.useContext(PickersContext) as PickersContextValue<TValue> | null;
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickersContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
