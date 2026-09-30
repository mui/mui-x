import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

function CustomLoading(props) {
  const { message = 'Loading…', ownerState, ...other } = props;

  return (
    <Stack {...other} spacing={1.5} sx={{ alignItems: 'center', py: 4 }}>
      <CircularProgress size={24} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Stack>
  );
}

export default function LoadingCustomIndicator() {
  return (
    <RichTreeView
      items={[]}
      loading
      slots={{ loading: CustomLoading }}
      slotProps={{ loading: { message: 'Fetching items…' } }}
      sx={{ width: 300 }}
    />
  );
}
