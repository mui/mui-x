import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function InitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [{ field: 'quantity', operator: '>', value: 10000 }],
            },
          },
          sorting: {
            sortModel: [{ field: 'desk', sort: 'asc' }],
          },
        }}
      />
    </div>
  );
}
