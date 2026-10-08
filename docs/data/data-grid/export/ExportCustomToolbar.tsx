import Button from '@mui/material/Button';
import { DataGrid, Toolbar, ExportCsv, ExportPrint } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  return (
    <Toolbar>
      <ExportCsv render={<Button />}>Download as CSV</ExportCsv>
      <ExportPrint render={<Button />}>Print</ExportPrint>
    </Toolbar>
  );
}

export default function ExportCustomToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}
