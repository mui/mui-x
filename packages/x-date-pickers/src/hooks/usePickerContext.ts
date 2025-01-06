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
  TError = string,
>() => {
  const value = React.useContext(PickerContext) as PickerContextValue<TValue, TView, TError>;
  if (value == null) {
    throw new Error(
      'MUI X: The `usePickerContext` hook can only be called inside the context of a picker component',
    );
  }

  return value;
};
