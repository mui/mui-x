import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';

const series = [
  {
    data: [
      { id: 0, value: 10, label: 'series A' },
      { id: 1, value: 15, label: 'series B' },
      { id: 2, value: 20, label: 'series C' },
    ],
  },
];

export default function HiddenLegend() {
  const [isHidden, setIsHidden] = React.useState(false);

  const Toggle = (
    <FormControlLabel
      checked={isHidden}
      control={<Checkbox onChange={(event) => setIsHidden(event.target.checked)} />}
      label="hide the legend"
      labelPlacement="end"
      sx={{ margin: 'auto' }}
    />
  );

  return (
    <Stack>
      {Toggle}
      <PieChart series={series} hideLegend={isHidden} width={200} height={200} />
    </Stack>
  );
}
