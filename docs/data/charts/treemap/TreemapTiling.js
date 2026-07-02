import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const methods = ['squarify', 'binary', 'slice', 'dice', 'sliceDice'];

const data = {
  id: 'root',
  children: [
    {
      id: 'A',
      children: [
        { id: 'A1', value: 40 },
        { id: 'A2', value: 25 },
        { id: 'A3', value: 15 },
      ],
    },
    {
      id: 'B',
      children: [
        { id: 'B1', value: 30 },
        { id: 'B2', value: 20 },
      ],
    },
    {
      id: 'C',
      children: [
        { id: 'C1', value: 18 },
        { id: 'C2', value: 12 },
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
        series={{ data, tiling: { method, paddingInner: 2, paddingOuter: 2 } }}
        height={300}
      />
    </Stack>
  );
}
