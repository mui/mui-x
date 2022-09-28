import * as React from 'react';
import { getBasicGridData, GridBasicData } from '../services';

export const useBasicDemoData = (nbRows: number, nbCols: number): GridBasicData => {
  const [data, setData] = React.useState<GridBasicData>({ rows: [], columns: [] });

  React.useEffect(() => {
    const newData = getBasicGridData(nbRows, nbCols);
    setData(newData);
  }, [nbRows, nbCols]);

  return data;
};
