import * as React from 'react';
import {
  DataGridPremium,
  GridToolbar,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const hiddenFields = ['id', GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, 'status'];

const getTogglableColumns = (columns) => {
  return columns
    .filter((column) => !hiddenFields.includes(column.field))
    .map((column) => column.field);
};

export default function ColumnSelectorGridCustomizeColumns() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        model: ['status'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        {...data}
        initialState={initialState}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          columnsManagement: {
            getTogglableColumns,
          },
        }}
      />
    </div>
  );
}
