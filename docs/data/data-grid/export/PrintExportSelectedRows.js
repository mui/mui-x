import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGrid,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';

const getSelectedRowsToExport = ({ apiRef }) => {
  const selectedRowIds = Array.from(apiRef.current.getSelectedRows().keys());

  if (selectedRowIds.length > 0) {
    return selectedRowIds;
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
