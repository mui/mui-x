import type { GridRowParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DisableRowSelection() {
  // @focus-start @padding 1
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        isRowSelectable={(params: GridRowParams) => params.row.quantity > 50000}
        checkboxSelection
      />
    </div>
  );
  // @focus-end
}
