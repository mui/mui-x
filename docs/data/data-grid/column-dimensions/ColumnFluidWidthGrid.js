import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

export default function ColumnFluidWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          {
            field: 'id',
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'username',
            width: 200,
          },
          {
            field: 'age',
            flex: 0.3,
            minWidth: 50,
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
