import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 10 },
};

export default function ServerSideTreeDataNestedLazyLoading() {
  const apiRef = useGridApiRef();

  const { fetchRows, columns, initialState } = useMockServer(dataSetOptions);

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          start: params.start.toString(),
          end: params.end.toString(),
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
      getChildrenCount: (row) => row.childrenCount,
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        dataSource={dataSource}
        treeData
        apiRef={apiRef}
        pageSizeOptions={pageSizeOptions}
        initialState={initialStateWithPagination}
        lazyLoading
      />
    </div>
  );
}
