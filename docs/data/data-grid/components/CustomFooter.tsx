import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridSlotsComponentsProps } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

type FooterStatus = 'connected' | 'disconnected';

declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    status: FooterStatus;
  }
}

export function CustomFooterStatusComponent(
  props: NonNullable<GridSlotsComponentsProps['footer']>,
) {
  return (
    <Box sx={{ p: 1, display: 'flex' }}>
      <FiberManualRecordIcon
        fontSize="small"
        sx={{
          mr: 1,
          color: props.status === 'connected' ? '#4caf50' : '#d9182e',
        }}
      />
      Status {props.status}
    </Box>
  );
}

export default function CustomFooter() {
  const [status, setStatus] = React.useState<FooterStatus>('connected');
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 4,
    maxColumns: 6,
  });
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 350, width: '100%', mb: 1 }}>
        <DataGrid
          {...data}
          slots={{
            footer: CustomFooterStatusComponent,
          }}
          slotProps={{
            footer: { status },
          }}
        />
      </Box>
      <Button
        variant="contained"
        onClick={() =>
          setStatus((current) =>
            current === 'connected' ? 'disconnected' : 'connected',
          )
        }
      >
        {status === 'connected' ? 'Disconnect' : 'Connect'}
      </Button>
    </Box>
  );
}
