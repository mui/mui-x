import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    {
      id: 'A',
      children: [
        { id: 'A1', value: 30 },
        { id: 'A2', value: 20 },
      ],
    },
    {
      id: 'B',
      children: [
        { id: 'B1', value: 25 },
        { id: 'B2', value: 15 },
      ],
    },
    {
      id: 'C',
      children: [
        { id: 'C1', value: 18 },
        { id: 'C2', value: 10 },
      ],
    },
  ],
};

export default function TreemapRenderMode() {
  const [renderMode, setRenderMode] = React.useState<'all' | 'leaf'>('all');

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <TextField
        select
        label="Render mode"
        value={renderMode}
        onChange={(event) => setRenderMode(event.target.value as 'all' | 'leaf')}
        sx={{ maxWidth: 220 }}
      >
        <MenuItem value="all">all</MenuItem>
        <MenuItem value="leaf">leaf</MenuItem>
      </TextField>
      <Treemap series={{ data, nodeOptions: { renderMode } }} height={300} />
    </Stack>
  );
}
