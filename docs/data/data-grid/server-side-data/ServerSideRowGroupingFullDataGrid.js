import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

export default function ServerSideRowGroupingFullDataGrid() {
  const apiRef = useGridApiRef();

  const { fetchRows, editRow, columns, loadNewData } = useMockServer({
    rowGrouping: true,
    rowLength: 1000,
    dataSet: 'Commodity',
    maxColumns: 20,
    editable: true,
  });

  const dataSource = React.useMemo(() => {
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
      updateRow: async (params) => {
        const syncedRow = await editRow(params.rowId, params.updatedRow);
        return syncedRow;
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
    };
  }, [fetchRows, editRow]);

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
          dataSource={dataSource}
          apiRef={apiRef}
          initialState={initialState}
          showToolbar
          groupingColDef={{
            width: 250,
          }}
        />
      </div>
    </div>
  );
}
