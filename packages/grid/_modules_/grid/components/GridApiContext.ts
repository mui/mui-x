import * as React from 'react';
import { GridApiRef } from '../models/api/gridApiRef';

export const GridApiContext = React.createContext<GridApiRef | undefined>(undefined);
