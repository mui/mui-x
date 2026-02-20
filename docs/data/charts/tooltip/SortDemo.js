import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

const sortOptions = ['none', 'asc', 'desc'];

function getExample(sort) {
  return `<LineChart
  slotProps={{ tooltip: { trigger: 'axis', sort: '${sort}' } }}
  {/* ... */}
/>`;
}

export default function SortDemo() {
  const [sort, setSort] = React.useState('none');

  return (
    <Box sx={{ p: 2, width: 1, maxWidth: 600 }}>
      <TextField
        select
        label="sort"
        value={sort}
        sx={{ minWidth: 200, mb: 2 }}
        onChange={(event) => setSort(event.target.value)}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <LineChart
        xAxis={[
          {
            scaleType: 'point',
            data: ['page A', 'page B', 'page C', 'page D', 'page E'],
          },
        ]}
        series={[
          { data: [2, 5, 3, 4, 1], label: 'Series x', showMark: true },
          { data: [5, 3, 1, null, 10], label: 'Series y', showMark: true },
          { data: [10, 4, 6, 2, 8], label: 'Series z', showMark: true },
        ]}
        slotProps={{ tooltip: { trigger: 'axis', sort } }}
        height={300}
        hideLegend
        margin={{ top: 20, right: 10 }}
      />
      <HighlightedCode code={getExample(sort)} language="tsx" />
    </Box>
  );
}
