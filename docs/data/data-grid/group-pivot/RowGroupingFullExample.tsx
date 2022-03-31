import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  useDemoData,
  useKeepGroupingColumnsHidden,
} from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['commodity'];

export default function RowGroupingFullExample() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 25,
  });
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columns}
        loading={loading}
        disableSelectionOnClick
        initialState={{
          ...data.initialState,
          columns: {
            ...data.initialState?.columns,
            columnVisibilityModel: {
              ...data.initialState?.columns?.columnVisibilityModel,
              ...Object.fromEntries(
                INITIAL_GROUPING_COLUMN_MODEL.map((field) => [field, false]),
              ),
            },
          },
          rowGrouping: {
            model: INITIAL_GROUPING_COLUMN_MODEL,
          },
          sorting: {
            sortModel: [{ field: '__row_group_by_columns_group__', sort: 'asc' }],
          },
        }}
        groupingColDef={{
          leafField: 'traderEmail',
        }}
        experimentalFeatures={{
          rowGrouping: true,
        }}
      />
    </div>
  );
}
