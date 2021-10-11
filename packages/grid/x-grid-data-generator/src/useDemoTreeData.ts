import * as React from 'react';
import { GridDemoData, randomInt } from '@mui/x-data-grid-generator/services';
import { DataGridProProps, GridColumns, GridRowModel } from '@mui/x-data-grid-pro';

interface GridDemoTreeDataOptions {
  rowLength: number[];
}

interface GridDemoTreeData extends GridDemoData, Pick<DataGridProProps, 'getTreeDataPath'> {}

interface GridDemoTreeDataResponse {
  loading: boolean;
  data: GridDemoTreeData;
}

const TREE_DATA_COLUMNS: GridColumns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'index',
    headerName: 'Index',
    width: 50,
    type: 'number',
  },
];

const getTreeDataPath = (row: GridRowModel) => row.path.map((value) => `Element ${value}`);

interface GetTreeDataRowsOptions {
  rowLength: number[];
  parentPath?: string[];
  id?: number;
}

const getTreeDataRows = ({ rowLength, parentPath = [], id = 0 }: GetTreeDataRowsOptions) => {
  const rows: GridRowModel[] = [];

  const [currentDepthRowLength, ...restRowLength] = rowLength;

  // For top level rows we respect the exact length given, for deeper rows we add a random factor
  const realCurrentDepthRowLength =
    parentPath.length === 0 ? currentDepthRowLength : randomInt(0, currentDepthRowLength * 2);

  for (let index = 1; index < realCurrentDepthRowLength + 1; index += 1) {
    const path = [...parentPath, index.toString()];
    const name = `Element n°${path.join('-')}`;
    rows.push({ name, path, index, id });

    id += 1;

    if (restRowLength.length) {
      const childrenRows = getTreeDataRows({ rowLength: restRowLength, parentPath: path, id });

      rows.push(...childrenRows.rows);
      id = childrenRows.id;
    }
  }

  return { rows, id };
};

export const useDemoTreeData = (options: GridDemoTreeDataOptions) => {
  const [response, setResponse] = React.useState<GridDemoTreeDataResponse>(() => ({
    loading: true,
    data: { columns: TREE_DATA_COLUMNS, getTreeDataPath, rows: [] },
  }));

  const rowLengthStr = options.rowLength.join('-');

  React.useEffect(() => {
    setResponse((prev) => (prev.loading ? prev : { ...prev, loading: true }));
    const { rows } = getTreeDataRows({
      rowLength: rowLengthStr.split('-').map((el) => Number(el)),
    });

    setResponse((prev) => ({ ...prev, loading: false, data: { ...prev.data, rows } }));
  }, [rowLengthStr]);

  return response;
};
