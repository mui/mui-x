import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function KeepNonExistentRowsSelected() {
  // @focus-start @padding 1
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        showToolbar
      />
    </div>
  );
  // @focus-end
}
