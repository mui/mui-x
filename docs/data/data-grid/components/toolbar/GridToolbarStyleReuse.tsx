import * as React from 'react';
import { DataGrid, ToolbarRoot } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function GridToolbarStyleReuse() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
    visibleFields: ['commodity', 'quantity', 'unitPrice'],
  });

  return (
    <Paper variant="outlined" sx={{ width: '100%' }}>
      <ToolbarRoot sx={{ justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 'medium', paddingLeft: 1 }}>
          Commodities
        </Typography>
        <Button size="small">Learn more</Button>
      </ToolbarRoot>
      <div style={{ height: 300 }}>
        <DataGrid
          {...data}
          loading={loading}
          sx={{ border: 0, borderRadius: 0 }}
          hideFooter
        />
      </div>
    </Paper>
  );
}
