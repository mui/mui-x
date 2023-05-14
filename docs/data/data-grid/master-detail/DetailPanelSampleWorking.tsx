import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridColDef,
  DataGridProProps,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid-pro'
import {
  Button,
  Typography,
  Stack,
  Paper,
} from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', },
];

type MyObjectType = {
  id: GridRowId
  name: string
};

const generateRows = (): MyObjectType[] => {
  const objects: MyObjectType[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 5; i++) {
    const gen = `obj-${i}`;
    const newObj: MyObjectType = {
      id: i, // if this is selected, Toggle Item ID String(2) Button shouldn't work.
      // id: i.toString(), // if this is selected, Toggle Item ID Number(3) Button shouldn't work.
      name: gen
    };

    objects.push(newObj);
  }

  return objects;
};

function DetailPanelContent({ row }: { row: any }) {
  return (
    <Stack sx={{ py: 2, height: 1, boxSizing: 'border-box' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${row.id}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            Customer information, Hello World!
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default function DetailPanelSampleWorking() {
  const apiRef = useGridApiRef();

  const getDetailPanelContent = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => <DetailPanelContent row={row} />, []);

  const getDetailPanelHeight = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelHeight']>
  >(() => 'auto' as const, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Button
        variant="contained"
        onClick={() => {
          apiRef.current.toggleDetailPanel('2');
        }}
        sx={{m:2}}
      >
        Toggle Item ID String(2) 
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          apiRef.current.toggleDetailPanel(3);
        }}
        sx={{m:2}}
      >
        Toggle Item ID Number(3)
      </Button>
      <DataGridPro
        rows={generateRows()}
        columns={columns}
        apiRef={apiRef}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        autoHeight
      />
    </Box>
  );
}
