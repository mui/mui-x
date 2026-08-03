import * as React from 'react';
import {
  DataGridPremium,
  GridDataSource,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

export default function ServerSideRowGroupingNestedLazyLoading() {
  const apiRef = useGridApiRef();

  const { fetchRows, columns } = useMockServer({
    dataSet: 'Movies',
  });

  const dataSource: GridDataSource = React.useMemo(() => {
    return {
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          start: params.start.toString(),
          end: params.end.toString(),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.childrenCount,
    };
  }, [fetchRows]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    },
  });

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        apiRef={apiRef}
        initialState={initialState}
        disablePivoting
        lazyLoading
        pageSizeOptions={[5, 10, 50]}
      />
    </div>
  );
}
