import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function ExcelExportWithWebWorker() {
  const [inProgress, setInProgress] = React.useState(false);

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50_000,
    editable: true,
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <Snackbar open={inProgress} TransitionComponent={SlideTransition}>
        <Alert severity="info" icon={<CircularProgress size={24} />}>
          Exporting Excel file...
        </Alert>
      </Snackbar>
      <DataGridPremium
        {...data}
        loading={loading}
        rowHeight={38}
        checkboxSelection
        showToolbar
        onExcelExportStateChange={(newState) =>
          setInProgress(newState === 'pending')
        }
        slotProps={{
          toolbar: {
            excelOptions: {
              worker: () =>
                new Worker(new URL('./excelExportWorker.ts', import.meta.url)),
            },
          },
        }}
      />
    </Box>
  );
}
