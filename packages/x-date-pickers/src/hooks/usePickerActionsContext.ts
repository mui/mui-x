'use client';
import * as React from 'react';
import { PickerActionsContext } from '../internals/components/PickerProvider';

/**
 * Returns a subset of the context passed by the picker wrapping the current component.
 * It only contains the actions and never causes a re-render of the component using it.
 */
export const usePickerActionsContext = () => {
  const value = React.useContext(PickerActionsContext);
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickerActionsContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
