import * as React from 'react';
import { GridApiCommon } from '@mui/x-data-grid-pro';
import { getData, GridData } from '../data/data-service';

export function useData<Api extends GridApiCommon = any>(nbRows: number, nbCols: number) {
  const [data, setData] = React.useState<GridData<Api>>({ rows: [], columns: [] });

  React.useEffect(() => {
    const newData = getData<Api>(nbRows, nbCols);
    setData(newData);
  }, [nbRows, nbCols]);

  return data;
}
