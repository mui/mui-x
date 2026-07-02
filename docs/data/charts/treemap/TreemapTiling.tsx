import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-pro/Treemap';
import type { TreemapTilingMethod } from '@mui/x-charts-pro/Treemap';

const methods: TreemapTilingMethod[] = [
  'squarify',
  'binary',
  'slice',
  'dice',
  'sliceDice',
];

const data = {
  id: 'root',
  children: [
    { id: 'A', value: 40 },
    { id: 'B', value: 25 },
    { id: 'C', value: 20 },
    { id: 'D', value: 15 },
    { id: 'E', value: 10 },
    { id: 'F', value: 8 },
  ],
};

export default function TreemapTiling() {
  const [method, setMethod] = React.useState<TreemapTilingMethod>('squarify');

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <TextField
        select
        label="Tiling method"
        value={method}
        onChange={(event) => setMethod(event.target.value as TreemapTilingMethod)}
        sx={{ maxWidth: 220 }}
      >
        {methods.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>
      <Treemap series={{ data, tiling: { method, paddingInner: 2 } }} height={300} />
    </Stack>
  );
}
