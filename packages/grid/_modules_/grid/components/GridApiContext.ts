import * as React from 'react';
import { GridComponentProps } from '../GridComponentProps';
import { GridApiRef } from '../models/api/gridApiRef';

export const GridPropsContext = React.createContext<GridComponentProps>({columns: [], rows:[], licenseStatus: 'invalid'});
export const GridApiContext = React.createContext<GridApiRef | undefined>(undefined);
