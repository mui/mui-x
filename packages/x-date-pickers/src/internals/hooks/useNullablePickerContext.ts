'use client';
import * as React from 'react';
import { PickerContext } from '../../hooks/usePickerContext';

/**
 * Returns the context passed by the picker that wraps the current component.
 * If the context is not found, returns `null`.
 */
export const useNullablePickerContext = () => React.useContext(PickerContext);
