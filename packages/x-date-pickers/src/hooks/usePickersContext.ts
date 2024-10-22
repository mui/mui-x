'use client';
import * as React from 'react';
import { PickersContext } from '../internals/components/PickersProvider';

/**
 * Returns the context passed by the picker that wraps the current component.
 */
export const usePickersContext = () => {
  const value = React.useContext(PickersContext);
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickersContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
