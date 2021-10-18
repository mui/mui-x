import * as React from 'react';
import LRUCache from 'lru-cache';
import { DataGridProProps } from '@mui/x-data-grid-pro';
import { GeneratedDemoData, getRealData } from './services/real-data-service';
import { getCommodityColumns } from './commodities.columns';
import { getEmployeeColumns } from './employees.columns';
import asyncWorker from './asyncWorker';
import { GridColDefGenerator } from './services/gridColDefGenerator';
import { GridRowData } from '../../_modules_';
import { randomArrayItem } from './services';

const dataCache = new LRUCache<string, DemoData>({
  max: 10,
  maxAge: 60 * 5 * 1e3, // 5 minutes
});

export type DemoDataReturnType = {
  data: DemoData;
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
  treeData?: {
    /**
     * The field used to generate the path
     * If not defined, the tree data will not be built
     */
    groupingField?: string;

    /**
     * The depth of the tree
     * @default: 1
     */
    depth?: number;

    /**
     * The average amount of children in a node
     * @default: 2
     */
    averageChildren?: number;
  };
}

export interface DemoData
  extends Pick<DataGridProProps, 'getTreeDataPath' | 'treeData' | 'groupingColDef'>,
    GeneratedDemoData {}

// Generate fake data from a seed.
// It's about x20 faster than getRealData.
async function extrapolateSeed(
  rowLength: number,
  columns: GridColDefGenerator[],
  data: GeneratedDemoData,
): Promise<GeneratedDemoData> {
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

  const treeDataDepth = options.treeData?.depth ?? 1;
  const hasTreeData = treeDataDepth > 1 && options.treeData?.groupingField;

  const [data, setData] = React.useState<GeneratedDemoData>(() => ({
    columns: getColumns(),
    rows: [],
    getTreeDataPath: hasTreeData ? (row) => row.path : undefined,
    treeData: hasTreeData ? true : undefined,
  }));

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

      let newData: DemoData;
      const columns = getColumns();
      if (rowLength > 1000) {
        newData = await getRealData(1000, columns);
        newData = await extrapolateSeed(rowLength, columns, newData);
      } else {
        newData = await getRealData(rowLength, columns);
      }

      const averageChildren = options.treeData?.averageChildren ?? 2;

      if (hasTreeData) {
        const rowsByTreeDepth: Record<
          number,
          { [index: number]: { value: GridRowData; parentIndex: number | null } }
        > = {};
        const rowsCount = newData.rows.length;

        const groupingCol = newData.columns.find(
          (col) => col.field === options.treeData?.groupingField,
        );

        if (!groupingCol) {
          throw new Error('MUI: The tree data grouping field does not exist');
        }

        for (let i = 0; i < rowsCount; i += 1) {
          const row = newData.rows[i];

          const currentChunk =
            Math.floor((i * (averageChildren ** treeDataDepth - 1)) / rowsCount) + 1;
          const currentDepth = Math.floor(Math.log(currentChunk) / Math.log(averageChildren));

          if (!rowsByTreeDepth[currentDepth]) {
            rowsByTreeDepth[currentDepth] = {};
          }

          rowsByTreeDepth[currentDepth][i] = { value: row, parentIndex: null };
        }

        for (let i = 0; i < treeDataDepth; i += 1) {
          Object.keys(rowsByTreeDepth[i]).forEach((rowIndex) => {
            const row = rowsByTreeDepth[i][Number(rowIndex)];
            const path: string[] = [];
            let previousRow: { value: GridRowData; parentIndex: number | null } | null = null;
            for (let k = i; k >= 0; k -= 1) {
              let rowTemp: { value: GridRowData; parentIndex: number | null };
              if (k === i) {
                if (i > 0) {
                  row.parentIndex = Number(randomArrayItem(Object.keys(rowsByTreeDepth[i - 1])));
                }
                rowTemp = row;
              } else {
                rowTemp = rowsByTreeDepth[k][previousRow!.parentIndex!];
              }

              path.unshift(rowTemp.value[options.treeData?.groupingField!]);

              previousRow = rowTemp;
            }

            row.value.path = path;
          });
        }

        groupingCol.hide = true;
        newData.groupingColDef = {
          headerName: groupingCol.headerName ?? groupingCol.field,
        };
        newData.getTreeDataPath = (row) => row.path;
        newData.treeData = true;
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
  }, [
    rowLength,
    data.columns,
    options.dataSet,
    options.maxColumns,
    treeDataDepth,
    options.treeData?.groupingField,
    options.treeData?.averageChildren,
    hasTreeData,
    index,
    getColumns,
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
