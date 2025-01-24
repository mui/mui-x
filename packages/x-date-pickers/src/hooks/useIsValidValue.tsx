'use client';
import * as React from 'react';
import { PickerValidValue } from '../internals/models';

export const IsValidValueContext = React.createContext<(value: any) => boolean>(() => true);

/**
 * Returns a function to check if a value is valid according to the validation props passed to the parent picker.
 */
export function useIsValidValue<TValue extends PickerValidValue>() {
  return React.useContext(IsValidValueContext) as (value: TValue) => boolean;
}
