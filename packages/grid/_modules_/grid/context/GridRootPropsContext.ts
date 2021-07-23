import * as React from 'react';
import { GridComponentProps } from '../GridComponentProps';

const GridRootPropsContext = React.createContext<GridComponentProps | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridRootPropsContext.displayName = 'GridRootPropsContext';
}

export { GridRootPropsContext };
