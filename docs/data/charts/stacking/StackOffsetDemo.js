import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { BarChart } from '@mui/x-charts/BarChart';

const availableStackOffset = ['expand', 'diverging', 'none'];

const getSeries = ({ hasNegativeValue, stackOffset }) => [
  {
    label: 'A',
    data: [125, 450, 492, 625],
    stack: 'total',
    stackOffset,
  },
  {
    label: 'B',
    data: [50, hasNegativeValue ? -150 : 150, 203, 620],
    stack: 'total',
  },
  {
    label: 'C',
    data: [134, 215, 342, 402].map((y) => (hasNegativeValue ? -y : y)),
    stack: 'total',
  },
  {
    label: 'D',
    data: [315, 421, 289, 321].map((y) => (hasNegativeValue ? -y : y)),
    stack: 'total',
  },
];

export default function StackOffsetDemo() {
  const [stackOffset, setStackOffset] = React.useState('none');

  const [hasNegativeValue, setHasNegativeValue] = React.useState(true);

  return (
    <div>
      <Stack direction="row">
        <TextField
          sx={{ minWidth: 150, mr: 5 }}
          select
          label="stackOffset"
          value={stackOffset}
          onChange={(event) => setStackOffset(event.target.value)}
        >
          {availableStackOffset.map((offset) => (
            <MenuItem key={offset} value={offset}>
              {offset}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          checked={hasNegativeValue}
          onChange={(event) => setHasNegativeValue(event.target.checked)}
          control={<Switch color="primary" />}
          label="data has negative value"
          labelPlacement="end"
        />
      </Stack>
      <BarChart
        width={600}
        height={300}
        series={getSeries({ hasNegativeValue, stackOffset })}
      />
    </div>
  );
}
