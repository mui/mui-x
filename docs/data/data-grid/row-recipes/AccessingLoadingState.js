import Button from '@mui/material/Button';
import {
  DataGrid,
  Toolbar,
  useGridApiContext,
  gridRowsLoadingSelector,
  useGridSelector,
} from '@mui/x-data-grid';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const isLoading = useGridSelector(apiRef, gridRowsLoadingSelector);
  return (
    <Toolbar>
      <Button
        variant="outlined"
        loading={isLoading}
        onClick={() => apiRef.current?.setLoading(true)}
      >
        Set Loading
      </Button>
      {isLoading && (
        <Button onClick={() => apiRef.current?.setLoading(false)}>Cancel</Button>
      )}
    </Toolbar>
  );
}

const rows = [
  { id: 1, name: 'React' },
  { id: 2, name: 'MUI' },
];

const columns = [{ field: 'name' }];

export default function AccessingLoadingState() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}
