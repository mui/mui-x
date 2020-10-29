import * as React from 'react';
import { ApiRef } from '../models/api/apiRef';

export const ApiContext = React.createContext<ApiRef | undefined>(undefined);
