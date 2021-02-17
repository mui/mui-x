import * as React from 'react';
import { ApiRef } from '../models/api/apiRef';

export const GridApiContext = React.createContext<ApiRef | undefined>(undefined);
