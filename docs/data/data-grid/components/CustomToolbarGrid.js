import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomToolbar() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- This demo documents the legacy toolbar components and their migration to the new Toolbar.
    <GridToolbarContainer>
      <Typography
        sx={{
          fontWeight: 'medium',
          flex: 1,
          mx: 0.5,
        }}
      >
        Custom Toolbar
      </Typography>
      {/* eslint-disable-next-line @typescript-eslint/no-deprecated -- This demo documents the legacy toolbar components and their migration to the new Toolbar. */}
      <GridToolbarColumnsButton />
      {/* eslint-disable-next-line @typescript-eslint/no-deprecated -- This demo documents the legacy toolbar components and their migration to the new Toolbar. */}
      <GridToolbarFilterButton />
      {/* eslint-disable-next-line @typescript-eslint/no-deprecated -- This demo documents the legacy toolbar components and their migration to the new Toolbar. */}
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-deprecated -- This demo documents the legacy toolbar components and their migration to the new Toolbar. */}
      <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { material: { variant: 'outlined' } },
        }}
      />
    </GridToolbarContainer>
  );
}

export default function CustomToolbarGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}
