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
  const [showLabels, setShowLabels] = React.useState(true);

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <TextField
        select
        label="Labels"
        value={showLabels ? 'shown' : 'hidden'}
        onChange={(event) => setShowLabels(event.target.value === 'shown')}
        sx={{ maxWidth: 220 }}
      >
        <MenuItem value="shown">Shown</MenuItem>
        <MenuItem value="hidden">Hidden</MenuItem>
      </TextField>
      <Treemap series={{ data, nodeOptions: { showLabels } }} height={300} />
    </Stack>
  );
}
