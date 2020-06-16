import React from 'react';
import { GridApiRef } from '../gridApiRef';

export const ApiContext = React.createContext<GridApiRef | undefined>(undefined);
