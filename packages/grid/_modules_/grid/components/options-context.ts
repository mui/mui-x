import * as React from 'react';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../models/gridOptions';

export const OptionsContext = React.createContext<GridOptions>(DEFAULT_GRID_OPTIONS);
