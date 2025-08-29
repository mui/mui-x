import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import useNestedPagination from './useNestedPagination';

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 20 },
};
const serverOptions = {};

const initialPaginationModel = {
  pageSize: 5,
  page: 0,
};

export default function ServerSideTreeDataNestedPagination() {
  const apiRef = useGridApiRef();

  const { groupKeys, ...props } = useNestedPagination(initialPaginationModel);
  const { fetchRows, columns, initialState } = useMockServer(
    dataSetOptions,
    serverOptions,
    false,
    true,
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(groupKeys),
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
    [fetchRows, groupKeys],
  );

  return (
    <div style={{ width: '100%', height: 500 }}>
      <DataGridPro
        {...props}
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        treeData
        apiRef={apiRef}
        pagination
        pageSizeOptions={pageSizeOptions}
        initialState={initialState}
        showToolbar
      />
    </div>
  );
}
