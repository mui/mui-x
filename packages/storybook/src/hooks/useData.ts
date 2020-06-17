import { getData, GridData } from '../data/data-service';
import { useEffect, useState } from 'react';

export const useData = (nbRows: number, nbCols: number, onData?: (data: GridData) => void) => {
  const [data, setData] = useState<GridData>({ rows: [], columns: [] });

  const loadData = async () => {
    const data = await getData(nbRows, nbCols);
    if (onData != null) {
      onData(data);
    }
    setData(data);
  };

  useEffect(() => {
    loadData();
  }, [nbRows, nbCols]);

  return data;
};
