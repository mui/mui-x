import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function ListViewCell(params) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: params.row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {params.row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {params.row.position}
        </Typography>
      </Stack>
    </Stack>
  );
}

const listColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};

const VISIBLE_FIELDS = ['avatar', 'name', 'position'];

export default function ListViewMediaQuery() {
  const theme = useTheme();
  const isListView = useMediaQuery(theme.breakpoints.down('md'));

  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 5,
    visibleFields: VISIBLE_FIELDS,
  });

  const rowHeight = isListView ? 64 : 52;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxHeight: 400,
      }}
    >
      <DataGridPro
        {...data}
        loading={loading}
        rowHeight={rowHeight}
        unstable_listView={isListView}
        unstable_listColumn={listColDef}
      />
    </div>
  );
}
