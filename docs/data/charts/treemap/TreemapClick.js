import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Treemap } from '@mui/x-charts-premium/Treemap';

const data = {
  label: 'root',
  children: [
    { label: 'Marketing', value: 40 },
    { label: 'Engineering', value: 55 },
    { label: 'Sales', value: 32 },
    { label: 'Support', value: 18 },
    { label: 'Design', value: 15 },
  ],
};

export default function TreemapClick() {
  const [item, setItem] = React.useState(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%', alignItems: 'stretch' }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Treemap
          series={{ data }}
          height={300}
          onItemClick={(event, clicked) => setItem(clicked)}
        />
      </Box>
      <Box
        component="pre"
        sx={{
          flex: 1,
          minWidth: 0,
          m: 0,
          p: 1,
          maxHeight: { md: 300 },
          borderRadius: 1,
          bgcolor: 'action.hover',
          fontSize: 12,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        {item
          ? JSON.stringify(item, null, 2)
          : 'Click a tile to see the item payload.'}
      </Box>
    </Stack>
  );
}
