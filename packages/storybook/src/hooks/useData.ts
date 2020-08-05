import * as React from 'react';
import { getData, GridData } from '../data/data-service';

export function useData(nbRows: number, nbCols: number, onData?: (data: GridData) => void) {
  const [data, setData] = React.useState<GridData>({ rows: [], columns: [] });

  const loadData = React.useCallback(async () => {
    const newData = await getData(nbRows, nbCols);
    if (onData != null) {
      onData(newData);
    }
    return newData;
  }, [nbCols, nbRows, onData]);

  React.useEffect(() => {
    loadData().then((newData: GridData) => {
      setData(newData);
    });
  }, [loadData]);

  return data;
}
