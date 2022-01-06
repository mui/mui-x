import * as React from 'react';
import type { DataGridProcessedProps } from '../models/props/DataGridProps';
import type { DataGridProProcessedProps } from '../models/props/DataGridProProps';

const GridRootPropsContext = React.createContext<
  DataGridProcessedProps | DataGridProProcessedProps | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridRootPropsContext.displayName = 'GridRootPropsContext';
}

export { GridRootPropsContext };
