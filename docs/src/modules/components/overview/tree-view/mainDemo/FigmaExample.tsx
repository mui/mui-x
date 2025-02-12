import * as React from 'react';
import Stack from '@mui/material/Stack';

export default function FigmaExample() {
  return (
    <Stack sx={{ p: 1, width: '100%' }} direction="row" spacing={1}>
      <Stack>Tree View</Stack>
      <Stack>Editor</Stack>
    </Stack>
  );
}
