import * as React from 'react';
import { LRUCache } from 'lru-cache';
import { GridColumnVisibilityModel } from '@mui/x-data-grid-premium';
import { GridDemoData, getRealGridData } from '../services/real-data-service';
import { getCommodityColumns } from '../columns/commodities.columns';
import { getEmployeeColumns } from '../columns/employees.columns';
import asyncWorker from '../services/asyncWorker';
import { GridColDefGenerator } from '../services/gridColDefGenerator';
import {
  AddPathToDemoDataOptions,
  DemoTreeDataValue,
  addTreeDataOptionsToDemoData,
} from '../services/tree-data-generator';

const dataCache = new LRUCache<string, DemoTreeDataValue>({
  max: 10,
  ttl: 60 * 5 * 1e3, // 5 minutes
});

export type DemoDataReturnType = {
  data: DemoTreeDataValue;
  loading: boolean;
  setRowLength: (count: number) => void;
  loadNewData: () => void;
};

type DataSet = 'Commodity' | 'Employee';

export interface UseDemoDataOptions {
  dataSet: DataSet;
  rowLength: number;
  maxColumns?: number;
  visibleFields?: string[];
  editable?: boolean;
  treeData?: AddPathToDemoDataOptions;
}

// Generate fake data from a seed.
// It's about x20 faster than getRealData.
export async function extrapolateSeed(
  rowLength: number,
  data: GridDemoData,
): Promise<GridDemoData> {
  return new Promise<any>((resolve) => {
    const seed = data.rows;
    const rows = data.rows.slice();
    const tasks = { current: rowLength - seed.length };

    function work() {
      const row = {} as any;

      for (let j = 0; j < data.columns.length; j += 1) {
        const column = data.columns[j];
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

export const deepFreeze = <T>(object: T): T => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name as keyof T];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};

export interface ColumnsOptions
  extends Pick<UseDemoDataOptions, 'dataSet' | 'editable' | 'maxColumns' | 'visibleFields'> {}

export const getColumnsFromOptions = (options: ColumnsOptions): GridColDefGenerator[] => {
  let columns =
    options.dataSet === 'Commodity' ? getCommodityColumns(options.editable) : getEmployeeColumns();

  if (options.visibleFields) {
    columns = columns.map((col) =>
      options.visibleFields?.includes(col.field) ? col : { ...col, hide: true },
    );
  }
  if (options.maxColumns) {
    columns = columns.slice(0, options.maxColumns);
  }
  return columns;
};

export const getInitialState = (options: UseDemoDataOptions, columns: GridColDefGenerator[]) => {
  const columnVisibilityModel: GridColumnVisibilityModel = {};
  columns.forEach((col) => {
    if (col.hide) {
      columnVisibilityModel[col.field] = false;
    }
  });

  const groupingField = options.treeData?.groupingField;
  if (groupingField) {
    columnVisibilityModel![groupingField] = false;
  }

  return { columns: { columnVisibilityModel } };
};

export const useDemoData = (options: UseDemoDataOptions): DemoDataReturnType => {
  const [rowLength, setRowLength] = React.useState(options.rowLength);
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const columns = React.useMemo(() => {
    return getColumnsFromOptions({
      dataSet: options.dataSet,
      editable: options.editable,
      maxColumns: options.maxColumns,
      visibleFields: options.visibleFields,
    });
  }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);

  const [data, setData] = React.useState<DemoTreeDataValue>(() => {
    return addTreeDataOptionsToDemoData(
      {
        columns,
        rows: [],
        initialState: getInitialState(options, columns),
      },
      options.treeData,
    );
  });

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

      let newData: DemoTreeDataValue;
      if (rowLength > 1000) {
        newData = await getRealGridData(1000, columns);
        newData = await extrapolateSeed(rowLength, newData);
      } else {
        newData = await getRealGridData(rowLength, columns);
      }

      if (!active) {
        return;
      }

      newData = addTreeDataOptionsToDemoData(newData, {
        maxDepth: options.treeData?.maxDepth,
        groupingField: options.treeData?.groupingField,
        averageChildren: options.treeData?.averageChildren,
      });

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
  }, [
    rowLength,
    options.dataSet,
    options.maxColumns,
    options.treeData?.maxDepth,
    options.treeData?.groupingField,
    options.treeData?.averageChildren,
    index,
    columns,
  ]);

  return {
    data,
    loading,
    setRowLength,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
  };
};
