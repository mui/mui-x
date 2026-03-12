import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

const showMark = {
  all: true,
  even: ({ index }: { index: number }) => index % 2 === 0,
  none: false,
  last: 'last',
} as const;

const showMarkLabel = {
  all: `true`,
  even: `({ index }: { index: number }) => index % 2 === 0`,
  none: `false`,
  last: `'last'`,
} as const;

export default function ShowMarkOptions() {
  const [showMarkOption, setShowMarkOption] = React.useState<
    'all' | 'even' | 'none' | 'last'
  >('even');
  return (
    <Stack width="100%">
      <TextField
        select
        label="showMark"
        value={showMarkOption}
        onChange={(event) =>
          setShowMarkOption(event.target.value as 'all' | 'even' | 'none' | 'last')
        }
        sx={{ width: 200 }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="even">Even</MenuItem>
        <MenuItem value="last">Last</MenuItem>
      </TextField>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
        series={[
          {
            data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
            showMark: showMark[showMarkOption],
          },
        ]}
        height={300}
      />
      <HighlightedCode
        language="jsx"
        code={`series={[{
  // ...
  showMark: ${showMarkLabel[showMarkOption]}
}]}`}
      />
    </Stack>
  );
}
