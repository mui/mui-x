import * as React from 'react';
import { GridState } from '../hooks/features/core/gridState';
import { ApiRef } from '../models/api/apiRef';

export const ApiContext = React.createContext<ApiRef | undefined>(undefined);
export const StateContext = React.createContext<GridState | undefined>(undefined);
