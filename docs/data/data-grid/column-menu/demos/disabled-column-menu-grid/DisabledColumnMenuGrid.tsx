import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DisabledColumnMenuGrid() {
  // @focus-start @padding 1
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid {...data} disableColumnMenu />
    </div>
  );
  // @focus-end
}
