import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    { id: 'Marketing', value: 40 },
    { id: 'Engineering', value: 55 },
    { id: 'Sales', value: 32 },
    { id: 'Support', value: 18 },
    { id: 'Design', value: 15 },
  ],
};

export default function TreemapClick() {
  const [clicked, setClicked] = React.useState(null);

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Typography>Last clicked tile: {clicked ?? 'none'}</Typography>
      <Treemap
        series={{ data }}
        height={300}
        onItemClick={(event, item) => setClicked(String(item.nodeId))}
      />
    </Stack>
  );
}
