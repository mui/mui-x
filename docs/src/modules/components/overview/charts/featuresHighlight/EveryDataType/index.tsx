import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SelectChart from './SelectChart';
import { Funnel, Radar, LineAndBar, Pie } from './Charts';
import { sxColors } from '../colors';

export default function EveryDataType() {
  const [selected, setSelected] = React.useState(1);
  const [active, setActive] = React.useState(false);

  // React.useEffect(() => {
  //   if (active) {
  //     return undefined;
  //   }
  //   const timeout = setTimeout(() => setSelected((p) => (p + 1) % 4), 5000);

  //   return () => clearTimeout(timeout);
  // }, [selected, active]);
  return (
    <Stack
      spacing={3}
      sx={sxColors}
      flexGrow={1}
      justifyContent="space-between"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      <Stack>
        <Box
          sx={{
            flexGrow: 1,
            mb: 4,
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
      </Stack>
      <Stack>
        <Typography variant="subtitle2">A chart for every data type</Typography>
        <Typography variant="body2" color="text.secondary">
          Effectively visualize your data from a wide variety of charts—bar, line, pie, scatter, and
          more.
        </Typography>
      </Stack>
    </Stack>
  );
}
