import * as React from 'react';
import LRUCache from 'lru-cache';
import {
  getGridDefaultColumnTypes,
  GridRowModel,
  GridGetRowsParams,
  GridGetRowsResponse,
  GridColDef,
  GridInitialState,
  GridColumnVisibilityModel,
  GridDataSource,
} from '@mui/x-data-grid-pro';
import {
  UseDemoDataOptions,
  getColumnsFromOptions,
  extrapolateSeed,
  deepFreeze,
} from './useDemoData';
import { GridColDefGenerator } from '../services/gridColDefGenerator';
import { getRealGridData, GridDemoData } from '../services/real-data-service';
import { addTreeDataOptionsToDemoData } from '../services/tree-data-generator';
import {
  loadServerRows,
  processTreeDataRows,
  DEFAULT_DATASET_OPTIONS,
  DEFAULT_SERVER_OPTIONS,
} from './serverUtils';
import type { ServerOptions } from './serverUtils';

const dataCache = new LRUCache<string, GridDemoData>({
  max: 10,
  ttl: 60 * 5 * 1e3, // 5 minutes
});

type CreateDummyDataSourceResponse = {
  columns: GridColDef[];
  initialState: GridInitialState;
  getGroupKey?: (row: GridRowModel) => string;
  hasChildren?: (row: GridRowModel) => boolean;
  getChildrenCount?: (row: GridRowModel) => number;
  getRows: GridDataSource['getRows'];
  loadNewData: () => void;
};

const getInitialState = (columns: GridColDefGenerator[], groupingField?: string) => {
  const columnVisibilityModel: GridColumnVisibilityModel = {};
  columns.forEach((col) => {
    if (col.hide) {
      columnVisibilityModel[col.field] = false;
    }
  });

  if (groupingField) {
    columnVisibilityModel![groupingField] = false;
  }

  return { columns: { columnVisibilityModel } };
};

const defaultColDef = getGridDefaultColumnTypes();

export const useDemoDataSource = (
  dataSetOptions?: Partial<UseDemoDataOptions>,
  serverOptions?: ServerOptions,
): CreateDummyDataSourceResponse => {
  const [data, setData] = React.useState<GridDemoData>();
  const [index, setIndex] = React.useState(0);
  const options = { ...DEFAULT_DATASET_OPTIONS, ...dataSetOptions };

  const columns = React.useMemo(() => {
    return getColumnsFromOptions({
      dataSet: options.dataSet,
      editable: options.editable,
      maxColumns: options.maxColumns,
      visibleFields: options.visibleFields,
    });
  }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);

  const initialState = React.useMemo(
    () => getInitialState(columns, options.treeData?.groupingField),
    [columns, options.treeData?.groupingField],
  );

  const columnsWithDefaultColDef: GridColDef[] = React.useMemo(
    () =>
      columns.map((column) => ({
        ...defaultColDef[column.type || 'string'],
        ...column,
      })),
    [columns],
  );

  const isTreeData = options.treeData?.groupingField != null;

  const getGroupKey = React.useMemo(() => {
    if (isTreeData) {
      return (row: GridRowModel): string => row[options.treeData!.groupingField!];
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.treeData?.groupingField, isTreeData]);

  const hasChildren = React.useMemo(() => {
    if (isTreeData) {
      return (row: GridRowModel): boolean => row.hasChildren;
    }
    return undefined;
  }, [isTreeData]);

  const getChildrenCount = React.useMemo(() => {
    if (isTreeData) {
      return (row: GridRowModel): number => row.descendantCount;
    }
    return undefined;
  }, [isTreeData]);

  React.useEffect(() => {
    const cacheKey = `${options.dataSet}-${options.rowLength}-${index}-${options.maxColumns}`;

    // Cache to allow fast switch between the JavaScript and TypeScript version
    // of the demos.
    if (dataCache.has(cacheKey)) {
      const newData = dataCache.get(cacheKey)!;
      setData(newData);
      return undefined;
    }

    let active = true;

    (async () => {
      let rowData;
      const rowLength = options.rowLength;
      if (rowLength > 1000) {
        rowData = await getRealGridData(1000, columns);
        rowData = await extrapolateSeed(rowLength, rowData);
      } else {
        rowData = await getRealGridData(rowLength, columns);
      }

      if (!active) {
        return;
      }

      if (isTreeData) {
        rowData = addTreeDataOptionsToDemoData(rowData, {
          maxDepth: options.treeData?.maxDepth,
          groupingField: options.treeData?.groupingField,
          averageChildren: options.treeData?.averageChildren,
        });
      }

      if (process.env.NODE_ENV !== 'production') {
        deepFreeze(rowData);
      }

      dataCache.set(cacheKey, rowData);
      setData(rowData);
    })();

    return () => {
      active = false;
    };
  }, [
    columns,
    isTreeData,
    options.rowLength,
    options.treeData?.maxDepth,
    options.treeData?.groupingField,
    options.treeData?.averageChildren,
    options.dataSet,
    options.maxColumns,
    index,
  ]);

  const getRows = React.useCallback(
    async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      if (!data) {
        return new Promise<GridGetRowsResponse>((resolve) => {
          resolve({ rows: [], rowCount: 0 });
        });
      }
      let getRowsResponse: GridGetRowsResponse;
      const serverOptionsWithDefault = { ...DEFAULT_SERVER_OPTIONS, ...serverOptions };

      if (isTreeData /* || TODO: `isRowGrouping` */) {
        const { rows, rootRowCount } = await processTreeDataRows(
          data.rows,
          params,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );

        getRowsResponse = {
          rows: rows.slice().map((row) => ({ ...row, path: undefined })),
          rowCount: rootRowCount,
        };
      } else {
        // plain data
        const { returnedRows, nextCursor, totalRowCount } = await loadServerRows(
          data.rows,
          { ...params, ...params.paginationModel },
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );
        getRowsResponse = { rows: returnedRows, rowCount: totalRowCount, pageInfo: { nextCursor } };
      }

      return new Promise<GridGetRowsResponse>((resolve) => {
        resolve(getRowsResponse);
      });
    },
    [data, columnsWithDefaultColDef, isTreeData, serverOptions],
  );

  return {
    columns: columnsWithDefaultColDef,
    initialState,
    getGroupKey,
    hasChildren,
    getChildrenCount,
    getRows,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
  };
};
