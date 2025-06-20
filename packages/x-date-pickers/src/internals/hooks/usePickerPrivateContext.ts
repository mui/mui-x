'use client';
import * as React from 'react';
import { PickerPrivateContext, PickerPrivateContextValue } from '../components/PickerProvider';

/**
 * Returns the private context passed by the Picker wrapping the current component.
 */
export const usePickerPrivateContext = <TError = any>() =>
  React.useContext(PickerPrivateContext) as PickerPrivateContextValue<TError>;
