import * as React from 'react';
import {
  DataGridPro,
  GridRowModel,
  GridRowOrderChangeParams,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

function updateRowPosition(
  initialIndex: number,
  newIndex: number,
  rows: Array<GridRowModel>,
): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const rowsClone = [...rows];
        const row = rowsClone.splice(initialIndex, 1)[0];
        rowsClone.splice(newIndex, 0, row);
        resolve(rowsClone);
      },
      Math.random() * 500 + 100,
    ); // simulate network latency
  });
}

export default function RowOrderingGrid() {
  const { data, loading: initialLoadingState } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  const [rows, setRows] = React.useState(data.rows);
  const [loading, setLoading] = React.useState(initialLoadingState);

  React.useEffect(() => {
    setRows(data.rows);
  }, [data]);

  React.useEffect(() => {
    setLoading(initialLoadingState);
  }, [initialLoadingState]);

  const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
    setLoading(true);
    const newRows = await updateRowPosition(
      params.oldIndex,
      params.targetIndex,
      rows,
    );

    setRows(newRows);
    setLoading(false);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        rows={rows}
        rowReordering
        onRowOrderChange={handleRowOrderChange}
      />
    </div>
  );
}
