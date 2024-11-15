'use client';
import * as React from 'react';
import { PickerPrivateContext } from '../components/PickerProvider';

/**
 * Returns the private context passed by the picker that wraps the current component.
 */
export const usePickerPrivateContext = () => React.useContext(PickerPrivateContext);
