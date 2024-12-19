'use client';
import * as React from 'react';
import { PickerContext, PickerContextValue } from '../internals/components/PickerProvider';
import { DateOrTimeViewWithMeridiem, PickerValidValue, PickerValue } from '../internals/models';

/**
 * Returns the context passed by the picker that wraps the current component.
 */
export const usePickerContext = <
  TValue extends PickerValidValue = PickerValue,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeViewWithMeridiem,
>() => {
  const value = React.useContext(PickerContext) as PickerContextValue<TValue, TView>;
  if (value == null) {
    throw new Error(
      [
        'MUI X: The `usePickerContext` can only be called in fields that are used as a slot of a picker component',
      ].join('\n'),
    );
  }

  return value;
};
