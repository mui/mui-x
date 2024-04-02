import * as React from 'react';
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
import { UseDemoDataOptions, getColumnsFromOptions, extrapolateSeed } from './useDemoData';
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

type CreateDummyDataSourceResponse = {
  columns: GridColDef[];
  initialState: GridInitialState;
  getGroupKey?: (row: GridRowModel) => string;
  hasChildren?: (row: GridRowModel) => boolean;
  getChildrenCount?: (row: GridRowModel) => number;
  getRows: GridDataSource['getRows'];
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
  const previousRowLength = React.useRef<number>();
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
    const fetchData = async () => {
      // Fetch all the data on the first request
      let rowData;
      const rowLength = options.rowLength;
      if (rowLength > 1000) {
        rowData = await getRealGridData(1000, columns);
        rowData = await extrapolateSeed(rowLength, rowData);
      } else {
        rowData = await getRealGridData(rowLength, columns);
      }
      if (isTreeData) {
        rowData = addTreeDataOptionsToDemoData(rowData, {
          maxDepth: options.treeData?.maxDepth,
          groupingField: options.treeData?.groupingField,
          averageChildren: options.treeData?.averageChildren,
        });
      }
      setData(rowData);
      previousRowLength.current = rowLength;
    };
    fetchData();
  }, [
    columns,
    isTreeData,
    options.rowLength,
    options.treeData?.maxDepth,
    options.treeData?.groupingField,
    options.treeData?.averageChildren,
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
  };
};
