import * as React from 'react';
import type { DataGridProcessedProps } from '../models/props/DataGridProps';

const GridRootPropsContext = React.createContext<
  DataGridProcessedProps | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridRootPropsContext.displayName = 'GridRootPropsContext';
}

export { GridRootPropsContext };
