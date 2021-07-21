import * as React from 'react';
import { GridBaseComponentProps } from '../GridBaseComponentProps';

const GridRootPropsContext = React.createContext<GridBaseComponentProps | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridRootPropsContext.displayName = 'GridRootPropsContext';
}

export { GridRootPropsContext };
