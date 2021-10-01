import * as React from 'react';
import LRUCache from 'lru-cache';
import { GridDemoData, getRealData } from './services/real-data-service';
import { getCommodityColumns } from './commodities.columns';
import { getEmployeeColumns } from './employees.columns';
import asyncWorker from './asyncWorker';
import { GridColDefGenerator } from './services/gridColDefGenerator';

const dataCache = new LRUCache<string, GridDemoData>({
  max: 10,
  maxAge: 60 * 5 * 1e3, // 5 minutes
});

export type DemoDataReturnType = {
  data: GridDemoData;
  loading: boolean;
  setRowLength: (count: number) => void;
  loadNewData: () => void;
};

type DataSet = 'Commodity' | 'Employee';

export interface DemoDataOptions {
  dataSet: DataSet;
  rowLength: number;
  maxColumns?: number;
  editable?: boolean;
}

// Generate fake data from a seed.
// It's about x20 faster than getRealData.
async function extrapolateSeed(
  rowLength: number,
  columns: GridColDefGenerator[],
  data: GridDemoData,
): Promise<GridDemoData> {
  return new Promise<any>((resolve) => {
    const seed = data.rows;
    const rows = data.rows.slice();
    const tasks = { current: rowLength - seed.length };

    function work() {
      const row = {} as any;

      for (let j = 0; j < columns.length; j += 1) {
        const column = columns[j];
        const index = Math.round(Math.random() * (seed.length - 1));

        if (column.field === 'id') {
          row.id = `id-${tasks.current + seed.length}`;
        } else {
          row[column.field] = seed[index][column.field];
        }
      }

      rows.push(row);

      tasks.current -= 1;
    }

    asyncWorker({
      work,
      done: () => resolve({ ...data, rows }),
      tasks,
    });
  });
}

const deepFreeze = <T>(object: T): T => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  // eslint-disable-next-line no-restricted-syntax
  for (const name of propNames) {
    const value = object[name as keyof T];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};

export const useDemoData = (options: DemoDataOptions): DemoDataReturnType => {
  const [rowLength, setRowLength] = React.useState(options.rowLength);
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const getColumns = React.useCallback(() => {
    let columns =
      options.dataSet === 'Commodity'
        ? getCommodityColumns(options.editable)
        : getEmployeeColumns();

    if (options.maxColumns) {
      columns = columns.slice(0, options.maxColumns);
    }
    return columns;
  }, [options.dataSet, options.editable, options.maxColumns]);

  const [data, setData] = React.useState<GridDemoData>(() => ({ columns: getColumns(), rows: [] }));

  React.useEffect(() => {
    const cacheKey = `${options.dataSet}-${rowLength}-${index}-${options.maxColumns}`;

    // Cache to allow fast switch between the JavaScript and TypeScript version
    // of the demos.
    if (dataCache.has(cacheKey)) {
      const newData = dataCache.get(cacheKey)!;
      setData(newData);
      setLoading(false);
      return undefined;
    }

    let active = true;

    (async () => {
      setLoading(true);

      let newData: GridDemoData;
      const columns = getColumns();
      if (rowLength > 1000) {
        newData = await getRealData(1000, columns);
        newData = await extrapolateSeed(rowLength, columns, newData);
      } else {
        newData = await getRealData(rowLength, columns);
      }

      if (!active) {
        return;
      }

      // It's quite slow. No need for it in production.
      if (process.env.NODE_ENV !== 'production') {
        deepFreeze(newData);
      }

      dataCache.set(cacheKey, newData);
      setData(newData);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [rowLength, data.columns, options.dataSet, options.maxColumns, index, getColumns]);

  return {
    data,
    loading,
    setRowLength,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
  };
};
