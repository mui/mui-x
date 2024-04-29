import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridToolbar,
  GridDataSourceCache,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import { QueryClient } from '@tanstack/query-core';

const cacheInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const cache: GridDataSourceCache = {
  set: (key, value) => {
    cacheInstance.setQueryData(key, value);
  },
  get: (key) => {
    return cacheInstance.getQueryData(key);
  },
  clear: () => {
    cacheInstance.clear();
  },
};

const pageSizeOptions = [5, 10, 50];

export default function ServerSideTreeData() {
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
      <Button onClick={() => cache.clear()}>Reset cache</Button>
      <div style={{ height: 400 }}>
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
          defaultGroupingExpansionDepth={-1}
          filterDebounceMs={1000}
        />
      </div>
    </div>
  );
}
