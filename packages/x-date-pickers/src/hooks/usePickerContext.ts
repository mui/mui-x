'use client';
import * as React from 'react';
import type { PickerContextValue } from '../internals/components/PickerProvider';
import { DateOrTimeViewWithMeridiem, PickerValidValue, PickerValue } from '../internals/models';

export const PickerContext = React.createContext<PickerContextValue<any, any, any> | null>(null);

/**
 * Returns the context passed by the Picker wrapping the current component.
 */
export const usePickerContext = <
  TValue extends PickerValidValue = PickerValue,
  TView extends DateOrTimeViewWithMeridiem = DateOrTimeViewWithMeridiem,
  TError = string | null,
>() => {
  const value = React.useContext(PickerContext) as PickerContextValue<TValue, TView, TError>;
  if (value == null) {
    throw new Error(
      'MUI X: The `usePickerContext` hook can only be called inside the context of a Picker component',
    );
  }

  return value;
};
