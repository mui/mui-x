import {
  getGridDefaultColumnTypes,
  GridRowModel,
  GridGetRowsParams,
  GridGetRowsResponse,
  GridColDef,
  GridInitialState,
  GridDataSource,
} from '@mui/x-data-grid-pro';
import {
  UseDemoDataOptions,
  getColumnsFromOptions,
  getInitialState,
  extrapolateSeed,
} from './useDemoData';
import { getRealGridData, GridDemoData } from '../services/real-data-service';
import { addTreeDataOptionsToDemoData } from '../services/tree-data-generator';
import {
  loadServerRows,
  processTreeDataRows,
  DEFAULT_DATASET_OPTIONS,
  DEFAULT_SERVER_OPTIONS,
} from './serverUtils';
import type { ServerOptions } from './serverUtils';

type DataSourceRelatedProps = {
  columns: GridColDef[];
  initialState: GridInitialState;
  getGroupKey?: (row: GridRowModel) => string;
  hasChildren?: (row: GridRowModel) => boolean;
  getChildrenCount?: (row: GridRowModel) => number;
};

type CreateDummyDataSourceResponse = [dataSource: GridDataSource, props: DataSourceRelatedProps];

let data: GridDemoData;
let isDataFetched = false;
let previousRowLength: number;

export const createDummyDataSource = (
  dataSetOptions?: Partial<UseDemoDataOptions>,
  serverOptions?: ServerOptions,
): CreateDummyDataSourceResponse => {
  const dataSetOptionsWithDefault = { ...DEFAULT_DATASET_OPTIONS, ...dataSetOptions };
  const serverOptionsWithDefault = { ...DEFAULT_SERVER_OPTIONS, ...serverOptions };

  const columns = getColumnsFromOptions(dataSetOptionsWithDefault);
  const initialState = getInitialState(dataSetOptionsWithDefault, columns);

  const defaultColDef = getGridDefaultColumnTypes();
  const columnsWithDefaultColDef: GridColDef[] = columns.map((column) => ({
    ...defaultColDef[column.type || 'string'],
    ...column,
  }));

  const isTreeData = dataSetOptionsWithDefault.treeData?.groupingField != null;

  let getGroupKey;
  let hasChildren;
  let getChildrenCount;
  if (isTreeData) {
    getGroupKey = (row: GridRowModel): string =>
      row[dataSetOptionsWithDefault.treeData!.groupingField!];
    hasChildren = (row: GridRowModel): boolean => row.hasChildren;
    getChildrenCount = (row: GridRowModel): number => row.descendantCount;
  }
  const getRows = async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
    if (!isDataFetched || previousRowLength !== dataSetOptionsWithDefault.rowLength) {
      // Fetch all the data on the first request
      const rowLength = dataSetOptionsWithDefault.rowLength;
      if (rowLength > 1000) {
        data = await getRealGridData(1000, columns);
        data = await extrapolateSeed(rowLength, data);
      } else {
        data = await getRealGridData(rowLength, columns);
      }
      if (isTreeData) {
        data = addTreeDataOptionsToDemoData(data, dataSetOptionsWithDefault.treeData);
      }
      isDataFetched = true;
      previousRowLength = rowLength;
    }

    let getRowsResponse: GridGetRowsResponse;

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
  };

  return [
    { getRows },
    {
      columns: columnsWithDefaultColDef,
      initialState,
      getGroupKey,
      hasChildren,
      getChildrenCount,
    },
  ];
};
