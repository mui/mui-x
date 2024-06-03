import * as React from 'react';
import { DataGridPro, useGridApiRef, GridToolbar } from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlateNoSnap';

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

const dataSource = {
  getRows: async (params) => {
    const urlParams = new URLSearchParams({
      paginationModel: encodeURIComponent(JSON.stringify(params.paginationModel)),
      filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
      sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
      groupKeys: encodeURIComponent(JSON.stringify(params.groupKeys)),
    });
    const serverResponse = await fetch(
      `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
    );
    const getRowsResponse = await serverResponse.json();
    return {
      rows: getRowsResponse.rows,
      rowCount: getRowsResponse.rowCount,
    };
  },
  getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
  hasChildren: (row) => row.hasChildren,
  getChildrenCount: (row) => row.descendantCount,
};

export default function ServerSideTreeData() {
  const apiRef = useGridApiRef();

  const { isInitialized, ...props } = useMockServer(dataSetOptions, {
    startServer: true,
  });

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
      <Button onClick={() => apiRef.current?.clearCache()}>Reset cache</Button>
      <div style={{ height: 400 }}>
        {isInitialized ? (
          <DataGridPro
            {...props}
            unstable_dataSource={dataSource}
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
