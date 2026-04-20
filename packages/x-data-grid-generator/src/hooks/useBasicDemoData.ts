import * as React from 'react';
import { getBasicGridData, type GridBasicData } from '../services';

export const useBasicDemoData = (nbRows: number, nbCols: number): GridBasicData => {
  return React.useMemo(() => getBasicGridData(nbRows, nbCols), [nbRows, nbCols]);
};
