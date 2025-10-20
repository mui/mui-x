import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
  GridGetRowsResponse,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];
const serverOptions = { useCursorPagination: false };
const dataSetOptions = {
  dataSet: 'Employee' as const,
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeDataExpansionPersistence() {
  const apiRef = useGridApiRef();

  const { fetchRows, ...props } = useMockServer<GridGetRowsResponse>(
    dataSetOptions,
    serverOptions,
  );

  const dataSource: GridDataSource = React.useMemo(
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
      <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
        <Button
          variant="outlined"
          onClick={() => {
            apiRef.current?.dataSource.fetchRows();
          }}
        >
          Fetch and keep the children
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            apiRef.current?.dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
              keepChildrenExpanded: false,
            });
          }}
        >
          Fetch and collapse the children
        </Button>
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPro
          {...props}
          treeData
          dataSource={dataSource}
          dataSourceCache={null}
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
        />
      </div>
    </div>
  );
}
