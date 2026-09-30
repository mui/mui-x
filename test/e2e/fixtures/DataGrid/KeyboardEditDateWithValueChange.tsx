import * as React from 'react';
import {
  DataGrid,
  DataGridProps,
  GridRenderEditCellParams,
  renderEditDateCell,
} from '@mui/x-data-grid';

const baselineProps: DataGridProps = {
  rows: [
    {
      id: 0,
      birthday: new Date(1984, 1, 29),
    },
  ],
  columns: [
    {
      field: 'birthday',
      type: 'date',
      editable: true,
      width: 120,
      renderEditCell: (params: GridRenderEditCellParams) =>
        renderEditDateCell({ ...params, onValueChange: () => {} }),
    },
  ],
};

export default function KeyboardEditDateWithValueChange() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid {...baselineProps} />
    </div>
  );
}
