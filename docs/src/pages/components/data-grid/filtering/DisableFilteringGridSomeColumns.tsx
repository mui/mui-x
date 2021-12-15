import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DisableFilteringGridSomeColumns() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) =>
        col.field === 'traderEmail' ? { ...col, filterable: false } : col,
      ),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} columns={columns} />
    </div>
  );
}
