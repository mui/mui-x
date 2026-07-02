import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    { id: 'Documents', value: 40 },
    { id: 'Photos', value: 30 },
    { id: 'Music', value: 20 },
    { id: 'Videos', value: 18 },
    { id: 'Apps', value: 12 },
    { id: 'Other', value: 6 },
  ],
};

export default function TreemapLabels() {
  const [mode, setMode] = React.useState('default');

  let showLabels = true;
  if (mode === 'hidden') {
    showLabels = false;
  } else if (mode === 'large') {
    showLabels = (node) => node.value >= 20;
  }

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <TextField
        select
        label="Labels"
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        sx={{ maxWidth: 220 }}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="large">Value ≥ 20 only</MenuItem>
        <MenuItem value="hidden">Hidden</MenuItem>
      </TextField>
      <Treemap series={{ data, nodeOptions: { showLabels } }} height={300} />
    </Stack>
  );
}
