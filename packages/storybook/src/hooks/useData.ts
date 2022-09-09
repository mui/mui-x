import * as React from 'react';
import { getData, GridData } from '../data/data-service';

export function useData(nbRows: number, nbCols: number) {
  const [data, setData] = React.useState<GridData>({ rows: [], columns: [] });

  React.useEffect(() => {
    const newData = getData(nbRows, nbCols);
    setData(newData);
  }, [nbRows, nbCols]);

  return data;
}
