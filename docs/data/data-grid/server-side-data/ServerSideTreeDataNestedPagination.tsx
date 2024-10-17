import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridToolbar,
  GridDataSource,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';
import { NestedPaginationGroupingCell } from './NestedPaginationGroupingCell';

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee' as const,
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 20 },
};

export default function ServerSideTreeDataNestedPagination() {
  const apiRef = useGridApiRef();
  const [expandedRows, setExpandedRows] = React.useState<GridValidRowModel[]>([]);
  const nestedLevelRef = React.useRef(0);

  React.useEffect(() => {
    nestedLevelRef.current = expandedRows.length;
  }, [expandedRows]);

  const { fetchRows, columns, initialState } = useMockServer(
    dataSetOptions,
    {},
    false,
    true,
  );

  const renderGroupingCell = React.useCallback(
    (params: GridRenderCellParams) => (
      <NestedPaginationGroupingCell
        {...params}
        nestedLevelRef={nestedLevelRef}
        setExpandedRows={setExpandedRows}
      />
    ),
    [setExpandedRows],
  );

  const initialStateWithPagination: GridInitialState = React.useMemo(
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

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(
            expandedRows?.map((row) => row.groupingKey) ?? [],
          ),
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
    [fetchRows, expandedRows],
  );

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current.unstable_dataSource.cache.clear()}>
        Reset cache
      </Button>
      <div style={{ height: 500 }}>
        <DataGridPro
          columns={columns}
          unstable_dataSource={dataSource}
          treeData
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialStateWithPagination}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          groupingColDef={{
            renderCell: renderGroupingCell,
          }}
          pinnedRows={{
            top: expandedRows,
          }}
        />
      </div>
    </div>
  );
}
