import { ColDef, RowData } from '@material-ui-x/grid';
import { getRealData } from './services/real-data-service';
import { useEffect, useState } from 'react';
import { commodityGeneratableColumns } from './real-data-demo.columns';

export type DemoDataReturnType = { data: { rows: RowData[]; columns: ColDef[] }; setSize: (count: number) => void };

export const useDemoData = (nbRows: number): DemoDataReturnType => {
  const [rows, setRows] = useState<RowData[]>([] as RowData[]);
  const [size, setSize] = useState(nbRows);

  const loadData = async () => {
    const data = await getRealData(size, commodityGeneratableColumns);
    setRows(data.rows);
  };

  useEffect(() => {
    loadData();
  }, [size]);

  return { data: { rows, columns: commodityGeneratableColumns }, setSize };
};
