import * as React from 'react';
import {
  PickersFieldContext,
  PickersFieldContextValue,
} from '../internals/components/PickersFieldProvider';

/**
 * Returns the context passed by the picker that wraps the current field.
 * If the field is used as a standalone component, the context will be `null`.
 */
export const usePickersFieldContext = <TOptional extends boolean = false>(
  params: { isOptional: TOptional } = { isOptional: false as TOptional },
) => {
  const value = React.useContext(PickersFieldContext);
  if (!params.isOptional && value == null) {
    throw new Error(
      [
        'MUI X: The `usePickersFieldContext` hook was used outside of the component tree of a picker.',
        'If your field component is usable as a standalone component, then to use the hook as follow:',
        '`usePickersFieldContext({ isOptional: true })`',
      ].join('\n'),
    );
  }

  return value as TOptional extends false
    ? PickersFieldContextValue
    : PickersFieldContextValue | null;
};
