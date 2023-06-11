import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  createFakeServer,
  loadTreeDataServerRows,
} from '@mui/x-data-grid-generator';

const initRows = [];

const DATASET_OPTION = {
  dataSet: 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 20 },
};

const { columnsWithDefaultColDef, useQuery, ...data } =
  createFakeServer(DATASET_OPTION);

const emptyObject = {};

export default function TreeDataLazyLoading() {
  const apiRef = useGridApiRef();
  const { rows: rowsServerSide } = useQuery(emptyObject);

  const onFetchRowChildren = React.useCallback(
    async ({ row, helpers, filterModel, sortModel }) => {
      const serverRows = await loadTreeDataServerRows(
        rowsServerSide,
        {
          filterModel,
          sortModel,
          path: row?.path ?? [],
        },
        {
          minDelay: 300,
          maxDelay: 800,
        },
        columnsWithDefaultColDef,
      );

      helpers.success(serverRows);
    },
    [rowsServerSide],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={rowsServerSide.length === 0}
        apiRef={apiRef}
        rows={initRows}
        getTreeDataPath={(row) => row.path}
        treeData
        unstable_headerFilters
        onFetchRowChildren={onFetchRowChildren}
        initialState={{
          ...data.initialState,
          columns: {
            ...data.initialState?.columns,
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
          filter: {
            filterModel: {
              items: [{ field: 'website', operator: 'contains', value: 'ab' }],
            },
          },
        }}
        isServerSideRow={(row) => row.hasChildren}
        getDescendantCount={(row) => row.descendantCount}
        rowsLoadingMode="server"
        filterMode="server"
        sortingMode="server"
      />
    </div>
  );
}
