import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

import Box from '@mui/material/Box';

function valueFormatter(v) {
  if (v === null) {
    return 'NaN';
  }
  return `${v.toLocaleString()}t CO2eq/pers`;
}

export default function DemoRadarSeriesHighlight() {
  const [highlightedItem, setHighlightedItem] = React.useState(null);

  const handleHighLightedSeries = (event, newHighLightedSeries) => {
    if (newHighLightedSeries !== null) {
      setHighlightedItem((prev) => ({
        ...prev,
        seriesId: newHighLightedSeries,
      }));
    }
  };
  return (
    <Stack sx={{ width: '100%' }} spacing={2} alignItems={'center'}>
      <ToggleButtonGroup
        value={highlightedItem?.seriesId ?? null}
        exclusive
        onChange={handleHighLightedSeries}
        aria-label="highlighted series"
        fullWidth
        size="small"
      >
        {series.map((item) => (
          <ToggleButton
            key={item.id}
            value={item.id}
            aria-label={`series ${item.label}`}
          >
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Box sx={{ width: '100%' }}>
        <RadarChart
          height={300}
          highlight="series"
          highlightedItem={highlightedItem}
          onHighlightChange={setHighlightedItem}
          series={series}
          radar={radar}
        />
      </Box>
    </Stack>
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel
const series = [
  {
    id: 'usa',
    label: 'USA',
    data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
    valueFormatter,
  },
  {
    id: 'australia',
    label: 'Australia',
    data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
    valueFormatter,
  },
  {
    id: 'united-kingdom',
    label: 'United Kingdom',
    data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
    valueFormatter,
  },
];

const radar = {
  metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
};
