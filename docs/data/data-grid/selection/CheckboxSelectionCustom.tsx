import * as React from 'react';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function CheckboxSelectionCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 5,
  });

  const columns = React.useMemo(
    () => [
      ...data.columns,
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
      },
    ],
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} checkboxSelection columns={columns} />
    </div>
  );
}
