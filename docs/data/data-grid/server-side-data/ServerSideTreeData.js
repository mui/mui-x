import * as React from 'react';
import { DataGridPro, useGridApiRef, GridToolbar } from '@mui/x-data-grid-pro';
import { createDummyDataSource } from '@mui/x-data-grid-generator';
import { QueryClient } from '@tanstack/query-core';

const [dataSource, props] = createDummyDataSource({
  dataSet: 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
});

const initialState = {
  ...props.initialState,
  pagination: {
    paginationModel: {
      pageSize: 5,
    },
  },
};

const cacheInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const cache = {
  set: (key, value) => {
    cacheInstance.setQueryData(key, value);
    console.log('setting cache', key, value);
  },
  get: (key) => {
    console.log('getting cache', key, cacheInstance.getQueryData(key));
    return cacheInstance.getQueryData(key);
  },
  invalidate: (queryKey) => {
    if (queryKey) {
      cacheInstance.invalidateQueries({ queryKey });
    }
    cacheInstance.invalidateQueries();
  },
};

const pageSizeOptions = [5, 10, 50];

export default function ServerSideTreeData() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...props}
        unstable_dataSource={dataSource}
        unstable_dataSourceCache={cache}
        treeData
        apiRef={apiRef}
        pagination
        pageSizeOptions={pageSizeOptions}
        initialState={initialState}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        filterDebounceMs={1000}
      />
    </div>
  );
}
