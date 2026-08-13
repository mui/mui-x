import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { RadarChart, RadarSeries } from '@mui/x-charts/RadarChart';

const metrics = ['Speed', 'Range', 'Comfort', 'Safety', 'Price', 'Handling'];

const highlightScope = { highlight: 'item' } as const;

const series: RadarSeries[] = [
  { label: 'Model A', data: [7, 4, 6, 8, 5, 9], highlightScope },
  { label: 'Model B', data: [4, 8, 9, 5, 7, 3], highlightScope },
];

export default function RadarClickToFocus() {
  const [focusItemOnClick, setFocusItemOnClick] = React.useState(false);
  const [clickableMarks, setClickableMarks] = React.useState(false);

  return (
    <Stack sx={{ width: '100%', display: 'block' }}>
      <Stack
        direction="row"
        sx={{ width: '100%', gap: 2, justifyContent: 'center', mb: 1 }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={focusItemOnClick}
              onChange={(event) => setFocusItemOnClick(event.target.checked)}
            />
          }
          label="focusItemOnClick"
        />
        <FormControlLabel
          control={
            <Switch
              checked={clickableMarks}
              onChange={(event) => setClickableMarks(event.target.checked)}
            />
          }
          label="onMarkClick"
        />
      </Stack>
      <RadarChart
        height={300}
        series={series}
        radar={{ metrics }}
        focusItemOnClick={focusItemOnClick}
        onMarkClick={clickableMarks ? () => {} : undefined}
      />
    </Stack>
  );
}
