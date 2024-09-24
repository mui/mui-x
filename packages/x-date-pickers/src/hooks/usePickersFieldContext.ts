import * as React from 'react';
import { PickersFieldContext } from '../internals/components/PickersFieldProvider';

/**
 * Returns the context passed by the picker that wraps the current field.
 */
export const usePickersFieldContext = () => {
  const value = React.useContext(PickersFieldContext);
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickersFieldContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
