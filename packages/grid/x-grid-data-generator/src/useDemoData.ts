import * as React from 'react';
import { ColDef, Columns, RowData } from '@material-ui/x-grid';
import { getRealData } from './services/real-data-service';
import { commodityColumns } from './commodities.columns';
import { employeeColumns } from './employees.columns';

export type DemoDataReturnType = {
  data: { rows: RowData[]; columns: ColDef[] };
  setSize: (count: number) => void;
  setDataset: (dataset: string) => void;
  loadNewData: () => Promise<void>;
};
export type DataSet = 'Commodity' | 'Employee';

export const useDemoData = (dataSetProp: DataSet, nbRows: number): DemoDataReturnType => {
  const [rows, setRows] = React.useState<RowData[]>([]);
  const [cols, setCols] = React.useState<Columns>([]);
  const [size, setSize] = React.useState(nbRows);
  const [dataset, setDataset] = React.useState(dataSetProp.toString());

  const loadData = async () => {
    const data = await getRealData(
      size,
      dataset === 'Commodity' ? commodityColumns : employeeColumns,
    );
    setRows([]);
    setCols(data.columns);
    setRows(data.rows);
  };

  React.useEffect(() => {
    loadData();
  }, [size, dataset]);

  return { data: { rows, columns: cols }, setSize, setDataset, loadNewData: loadData };
};
