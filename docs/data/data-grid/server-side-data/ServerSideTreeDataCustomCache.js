import * as React from 'react';
import { DataGridPro, useGridApiRef, GridToolbar } from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';
import { QueryClient } from '@tanstack/query-core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

function getKey(params) {
  return [
    params.paginationModel,
    params.sortModel,
    params.filterModel,
    params.groupKeys,
  ];
}

const cache = {
  set: (key, value) => {
    const queryKey = getKey(key);
    queryClient.setQueryData(queryKey, value);
  },
  get: (key) => {
    const queryKey = getKey(key);
    return queryClient.getQueryData(queryKey);
  },
  clear: () => {
    queryClient.clear();
  },
};

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeDataCustomCache() {
  const apiRef = useGridApiRef();

  const { fetchRows, ...props } = useMockServer(dataSetOptions);

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
    }),
    [fetchRows],
  );

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
          unstable_dataSourceCache={cache}
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
