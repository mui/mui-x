import { ColDef, Columns, RowData } from '@material-ui-x/grid';
import { getRealData } from './services/real-data-service';
import { useEffect, useState } from 'react';
import { commodityColumns } from './commodities.columns';
import { employeeColumns } from './employees.columns';

export type DemoDataReturnType = {
  data: { rows: RowData[]; columns: ColDef[] };
  setSize: (count: number) => void;
  setDataset: (dataset: string) => void;
};
export type DataSet = 'Commodity' | 'Employee';

export const useDemoData = (dataSetProp: DataSet, nbRows: number): DemoDataReturnType => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [cols, setCols] = useState<Columns>([]);
  const [size, setSize] = useState(nbRows);
  const [dataset, setDataset] = useState(dataSetProp.toString());

  const loadData = async () => {
    const data = await getRealData(size, dataset === 'Commodity' ? commodityColumns : employeeColumns);
    setRows(data.rows);
    setCols(data.columns);
  };

  useEffect(() => {
    loadData();
  }, [size, dataset]);

  return { data: { rows, columns: cols }, setSize, setDataset };
};
