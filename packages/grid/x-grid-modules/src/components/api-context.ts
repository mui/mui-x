import * as React from 'react';
import { GridApiRef } from '../models';

export const ApiContext = React.createContext<GridApiRef | undefined>(undefined);
