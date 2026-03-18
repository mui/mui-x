'use client';
import * as React from 'react';
import type { ChartsContextValue } from './ChartsProvider.types';

/**
 * @ignore - internal component.
 */
export const ChartsContext = React.createContext<ChartsContextValue<any> | null>(null);
