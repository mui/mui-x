import * as React from 'react';
import { getBasicGridData, GridBasicData } from '../services';

export const useBasicDemoData = (nbRows: number, nbCols: number): GridBasicData => {
  return React.useMemo(() => getBasicGridData(nbRows, nbCols), [nbRows, nbCols]);
};
