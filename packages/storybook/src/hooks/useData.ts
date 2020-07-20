import * as React from 'react';
import { getData, GridData } from '../data/data-service';

export function useData(nbRows: number, nbCols: number, onData?: (data: GridData) => void) {
  const [data, setData] = React.useState<GridData>({ rows: [], columns: [] });

  const loadData = async () => {
    const newData = await getData(nbRows, nbCols);
    if (onData != null) {
      onData(newData);
    }
    setData(newData);
  };

  React.useEffect(() => {
    loadData();
  }, [nbRows, nbCols]);

  return data;
}
