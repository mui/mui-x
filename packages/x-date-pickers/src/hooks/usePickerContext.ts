'use client';
import * as React from 'react';
import { PickerContext, PickerContextValue } from '../internals/components/PickerProvider';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

/**
 * Returns the context passed by the picker that wraps the current component.
 */
export const usePickerContext = <
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeViewWithMeridiem,
>() => {
  const value = React.useContext(PickerContext) as PickerContextValue<TView>;
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickerContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
