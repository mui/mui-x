import * as React from 'react';
import {
  DataGridPremium,
  GridDataSource,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridToolbar,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

export default function ServerSideRowGroupingFullDataGrid() {
  const apiRef = useGridApiRef();

  const { fetchRows, columns, loadNewData } = useMockServer({
    rowGrouping: true,
    rowLength: 1000,
    dataSet: 'Commodity',
    maxColumns: 20,
  });

  const dataSource: GridDataSource = React.useMemo(() => {
    return {
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
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
      getChildrenCount: (row) => row.descendantCount,
    };
  }, [fetchRows]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['commodity', 'status'],
      },
      columns: {
        columnVisibilityModel: {
          id: false,
        },
      },
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={loadNewData}>Regenerate Data</Button>

      <div style={{ height: 450, position: 'relative' }}>
        <DataGridPremium
          columns={columns}
          unstable_dataSource={dataSource}
          apiRef={apiRef}
          initialState={initialState}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          groupingColDef={{
            width: 250,
          }}
        />
      </div>
    </div>
  );
}
