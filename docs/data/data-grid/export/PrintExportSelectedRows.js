import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from '@mui/x-data-grid';

const getSelectedRowsToExport = ({ apiRef }) => {
  const selectedRowIds = selectedGridRowsSelector(apiRef);
  if (selectedRowIds.size > 0) {
    return Array.from(selectedRowIds.keys());
  }

  return gridFilteredSortedRowIdsSelector(apiRef);
};

export default function PrintExportSelectedRows() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        checkboxSelection
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport } },
        }}
      />
    </div>
  );
}
