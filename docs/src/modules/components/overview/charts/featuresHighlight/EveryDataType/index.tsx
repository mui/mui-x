/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { blackAndWhite, colorFull } from '../colors';
import SelectChart from './SelectChart';
import { Funnel, Radar, LineAndBar, Pie } from './Charts';

export default function EveryDataType() {
  const [selected, setSelected] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => setSelected((p) => (p + 1) % 4), 5000);

    return () => clearInterval(interval);
  }, [selected]);
  return (
    <Stack
      spacing={1}
      sx={{
        '--palette-color-0': blackAndWhite[0],
        '--palette-color-1': blackAndWhite[1],
        '--palette-color-2': blackAndWhite[2],
        '--palette-color-3': blackAndWhite[3],
        '--palette-color-4': blackAndWhite[4],
        '--palette-color-5': blackAndWhite[5],
        '--palette-color-6': blackAndWhite[6],

        '&:hover': {
          '--palette-color-0': colorFull[0],
          '--palette-color-1': colorFull[1],
          '--palette-color-2': colorFull[2],
          '--palette-color-3': colorFull[3],
          '--palette-color-4': colorFull[4],
          '--palette-color-5': colorFull[5],
          '--palette-color-6': colorFull[6],
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          mb: 2,
          width: '100%',
          height: 250,
        }}
      >
        {selected === 0 && <LineAndBar />}
        {selected === 1 && <Pie />}
        {selected === 2 && <Radar />}
        {selected === 3 && <Funnel />}
      </Box>
      <SelectChart selected={selected} setSelected={setSelected} />
      <Typography variant="subtitle2">A chart for every data type</Typography>
      <Typography variant="body2" color="text.secondary">
        A wide variety of chart types to choose from, including bar, line, pie, scatter, and more,
        to best visualize your data.
      </Typography>
    </Stack>
  );
}
