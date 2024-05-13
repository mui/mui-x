import * as React from 'react';
import { DataGridPro, useGridApiRef, GridToolbar } from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import { QueryClient } from '@tanstack/query-core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

const cache = {
  set: (key, value) => {
    queryClient.setQueryData(key, value);
  },
  get: (key) => {
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

  const { getRows, ...props } = useDemoDataSource({
    dataSet: 'Employee',
    rowLength: 1000,
    treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
  });

  const dataSource = React.useMemo(() => {
    return {
      getRows,
    };
  }, [getRows]);

  const initialState = React.useMemo(
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
      </div>
    </div>
  );
}
