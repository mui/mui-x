import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-premium/Treemap';

const methods = ['squarify', 'binary', 'slice', 'dice', 'sliceDice'];

const data = {
  label: 'root',
  children: [
    {
      label: 'A',
      children: [
        { label: 'A1', value: 40 },
        { label: 'A2', value: 25 },
        { label: 'A3', value: 15 },
      ],
    },
    {
      label: 'B',
      children: [
        { label: 'B1', value: 30 },
        { label: 'B2', value: 20 },
      ],
    },
    {
      label: 'C',
      children: [
        { label: 'C1', value: 18 },
        { label: 'C2', value: 12 },
      ],
    },
  ],
};

export default function TreemapTiling() {
  const [method, setMethod] = React.useState('squarify');

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <TextField
        select
        label="Tiling method"
        value={method}
        onChange={(event) => setMethod(event.target.value)}
        sx={{ maxWidth: 220 }}
      >
        {methods.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>
      <Treemap
        series={{
          data,
          tiling: { method },
        }}
        height={300}
      />
    </Stack>
  );
}
