import * as React from 'react';
import { ApiRef } from '../models';

export const ApiContext = React.createContext<ApiRef | undefined>(undefined);
