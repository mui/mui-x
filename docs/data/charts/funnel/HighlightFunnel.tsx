import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { FadeOptions, HighlightOptions } from '@mui/x-charts/context';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function HighlightFunnel() {
  const [highlight, setHighlight] = React.useState<HighlightOptions>('item');
  const [fade, setFade] = React.useState<FadeOptions>('global');

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
        <FunnelChart
          series={[
            {
              ...populationByEducationLevelPercentageSeriesLabeled,
              highlightScope: {
                highlight,
                fade,
              },
            },
          ]}
          {...funnelChartParams}
        />
        <FunnelChart
          series={[
            {
              ...populationByEducationLevelPercentageSeriesLabeled,
              variant: 'outlined',
              highlightScope: {
                highlight,
                fade,
              },
            },
          ]}
          {...funnelChartParams}
        />
      </Stack>

      <Controls
        highlight={highlight}
        setHighlight={setHighlight}
        fade={fade}
        setFade={setFade}
      />
    </Stack>
  );
}

const funnelChartParams = {
  height: 300,
  hideLegend: true,
};

function Controls({
  highlight,
  setHighlight,
  fade,
  setFade,
}: {
  highlight: string;
  setHighlight: React.Dispatch<React.SetStateAction<HighlightOptions>>;
  fade: string;
  setFade: React.Dispatch<React.SetStateAction<FadeOptions>>;
}) {
  return (
    <Stack
      direction={{ xs: 'row', xl: 'column' }}
      spacing={3}
      justifyContent="center"
      flexWrap="wrap"
      useFlexGap
    >
      <TextField
        select
        label="highlight"
        value={highlight}
        onChange={(event) => setHighlight(event.target.value as HighlightOptions)}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value={'none'}>none</MenuItem>
        <MenuItem value={'item'}>item</MenuItem>
        <MenuItem value={'series'}>series</MenuItem>
      </TextField>
      <TextField
        select
        label="fade"
        value={fade}
        onChange={(event) => setFade(event.target.value as FadeOptions)}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value={'none'}>none</MenuItem>
        <MenuItem value={'series'}>series</MenuItem>
        <MenuItem value={'global'}>global</MenuItem>
      </TextField>
    </Stack>
  );
}
