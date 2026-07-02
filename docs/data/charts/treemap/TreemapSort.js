import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    { id: 'Charlie', value: 15 },
    { id: 'Alpha', value: 45 },
    { id: 'Bravo', value: 30 },
    { id: 'Delta', value: 22 },
    { id: 'Echo', value: 10 },
  ],
};

export default function TreemapSort() {
  const [sort, setSort] = React.useState('auto');

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <TextField
        select
        label="Sort"
        value={sort}
        onChange={(event) => setSort(event.target.value)}
        sx={{ maxWidth: 220 }}
      >
        <MenuItem value="auto">auto</MenuItem>
        <MenuItem value="fixed">fixed</MenuItem>
      </TextField>
      {/* `dice` lays tiles left-to-right so the order change is easy to see. */}
      <Treemap series={{ data, tiling: { sort, method: 'dice' } }} height={300} />
    </Stack>
  );
}
