import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import type { IsRowReorderableParams } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const isRowReorderable = (params: IsRowReorderableParams) => {
  return params.row.quantity < 50000;
};

export default function RowReorderingDisabled() {
  // @focus-start @padding 1
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        rowReordering
        isRowReorderable={isRowReorderable}
      />
    </div>
  );
  // @focus-end
}
