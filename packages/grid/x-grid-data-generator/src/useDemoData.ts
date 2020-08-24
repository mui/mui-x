import * as React from 'react';
import { GridData, getRealData } from './services/real-data-service';
import { commodityColumns } from './commodities.columns';
import { employeeColumns } from './employees.columns';

export type DemoDataReturnType = {
  data: GridData;
  setRowLength: (count: number) => void;
  loadNewData: () => void;
};
export type DataSet = 'Commodity' | 'Employee';

interface DemoDataOptions {
  dataSet: DataSet;
  rowLength: number;
  maxColumns?: number;
}

export const useDemoData = (options: DemoDataOptions): DemoDataReturnType => {
  const [data, setData] = React.useState<GridData>({ columns: [], rows: [] });
  const [rowLength, setRowLength] = React.useState(options.rowLength);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    (async () => {
      let columns = options.dataSet === 'Commodity' ? commodityColumns : employeeColumns;

      if (options.maxColumns) {
        columns = columns.slice(0, options.maxColumns);
      }

      const newData = await getRealData(rowLength, columns);

      if (!active) {
        return;
      }

      setData(newData);
    })();

    return () => {
      active = false;
    };
  }, [rowLength, options.dataSet, index, options.maxColumns]);

  return {
    data,
    setRowLength,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
  };
};
