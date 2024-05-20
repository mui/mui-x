import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridToolbar,
  GridServerSideCache,
  GridDataSource,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';
import { QueryClient } from '@tanstack/query-core';
import LoadingSlate from './LoadingSlateNoSnap';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

const cache: GridServerSideCache = {
  set: (key: any[], value) => {
    queryClient.setQueryData(key, value);
  },
  get: (key: any[]) => {
    return queryClient.getQueryData(key);
  },
  clear: () => {
    queryClient.clear();
  },
  getKey: (params) => {
    return [
      params.paginationModel,
      params.sortModel,
      params.filterModel,
      params.groupKeys,
    ];
  },
};

const pageSizeOptions = [5, 10, 50];

export default function ServerSideTreeDataCustomCache() {
  const apiRef = useGridApiRef();

  const { isInitialized, fetchRows, ...props } = useMockServer({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
  });

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: encodeURIComponent(
            JSON.stringify(params.paginationModel),
          ),
          filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
          sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
          groupKeys: encodeURIComponent(JSON.stringify(params.groupKeys)),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
    }),
    [fetchRows],
  );

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...props.initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [props.initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => queryClient.clear()}>Reset cache</Button>
      <div style={{ height: 400 }}>
        {isInitialized ? (
          <DataGridPro
            {...props}
            unstable_dataSource={dataSource}
            unstable_serverSideCache={cache}
            treeData
            apiRef={apiRef}
            pagination
            pageSizeOptions={pageSizeOptions}
            initialState={initialState}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
        ) : (
          <LoadingSlate />
        )}
      </div>
    </div>
  );
}
