import * as React from 'react';
import LRUCache from 'lru-cache';
import { GridData, getRealData } from './services/real-data-service';
import { commodityColumns } from './commodities.columns';
import { employeeColumns } from './employees.columns';

const dataCache = new LRUCache({
  max: 10,
  maxAge: 60 * 5 * 1e3, // 5 minutes
});

export type DemoDataReturnType = {
  data: GridData;
  setRowLength: (count: number) => void;
  loadNewData: () => void;
};

type DataSet = 'Commodity' | 'Employee';

export interface DemoDataOptions {
  dataSet: DataSet;
  rowLength: number;
  maxColumns?: number;
}

// Generate fake data from a seed.
// It's about x20 faster than getRealData.
function extrapolateSeed(rowLength, columns, data) {
  const seed = data.rows;
  const rows = data.rows.slice();

  for (let i = 0; i < rowLength - seed.length; i += 1) {
    const row = {};

    for (let j = 0; j < columns.length; j += 1) {
      const column = columns[j];
      const index = Math.round(Math.random() * (seed.length - 1));

      if (column.field === 'id') {
        row[column.field] = `id-${i + seed.length}`;
      } else {
        row[column.field] = seed[index][column.field];
      }
    }

    rows.push(row);
  }

  return { ...data, rows };
}

async function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export const useDemoData = (options: DemoDataOptions): DemoDataReturnType => {
  const [data, setData] = React.useState<GridData>({ columns: [], rows: [] });
  const [rowLength, setRowLength] = React.useState(options.rowLength);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const cacheKey = `${options.dataSet}-${rowLength}-${index}-${options.maxColumns}`;

    // Cache to allow fast switch between the JavaScript and TypeScript version
    // of the demos.
    if (dataCache.has(cacheKey)) {
      const newData = dataCache.get(cacheKey);
      setData(newData);
      return undefined;
    }

    let active = true;

    (async () => {
      await sleep(100);
      let columns = options.dataSet === 'Commodity' ? commodityColumns : employeeColumns;

      if (options.maxColumns) {
        columns = columns.slice(0, options.maxColumns);
      }

      let newData;

      if (rowLength > 1000) {
        newData = await getRealData(1000, columns);
        await sleep(100);
        newData = extrapolateSeed(rowLength, columns, newData);
      } else {
        newData = await getRealData(rowLength, columns);
      }

      if (!active) {
        return;
      }

      dataCache.set(cacheKey, newData);
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
