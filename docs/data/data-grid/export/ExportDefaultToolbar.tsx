import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function ExportDefaultToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid {...data} loading={loading} showToolbar />
    </div>
  );
}
