import { ColDef, RowData } from '@material-ui-x/grid';
import { getRealData } from './services/real-data-service';
import { useEffect, useState } from 'react';
import { commodityGeneratableColumns } from './real-data-demo.columns';

export type DemoDataReturnType = { rows: RowData[]; columns: ColDef[] };

export const useDemoData = (nbRows: number): DemoDataReturnType => {
  const [rows, setRows] = useState<RowData[]>([]);

  const loadData = async () => {
    const data = await getRealData(nbRows, commodityGeneratableColumns);
    setRows(data.rows);
  };

  useEffect(() => {
    loadData();
  }, []);

  return { rows, columns: commodityGeneratableColumns };
};
