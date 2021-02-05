import * as React from 'react';
import LRUCache from 'lru-cache';
import { GridData, getRealData } from './services/real-data-service';
import { getCommodityColumns } from './commodities.columns';
import { getEmployeeColumns } from './employees.columns';

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

function deepFreeze(object) {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  // eslint-disable-next-line no-restricted-syntax
  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
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
      let columns = options.dataSet === 'Commodity' ? getCommodityColumns() : getEmployeeColumns();

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

      deepFreeze(newData);

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
