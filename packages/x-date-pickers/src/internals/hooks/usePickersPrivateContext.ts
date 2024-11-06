'use client';
import * as React from 'react';
import { PickersPrivateContext } from '../components/PickersProvider';

/**
 * Returns the private context passed by the picker that wraps the current component.
 */
export const usePickersPrivateContext = () => React.useContext(PickersPrivateContext);
