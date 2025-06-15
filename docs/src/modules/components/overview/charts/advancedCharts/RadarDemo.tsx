import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { RadarSeriesType } from '@mui/x-charts/models';
import { RadarChart, radarSeriesPlotClasses } from '@mui/x-charts/RadarChart';
import DemoWrapper from '../../DemoWrapper';

// Taken from https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_base_stats_in_Generation_I
// Looking for a better idea
const series: RadarSeriesType[] = [
  {
    type: 'radar',
    label: 'Bulbasaur',
    data: [45, 49, 49, 45, 65],
    color: 'green',

    hideMark: true,
  },

  {
    type: 'radar',
    label: 'Charmander',
    data: [39, 52, 43, 65, 50],
    color: 'red',
    hideMark: true,
  },
  {
    type: 'radar',
    label: 'Squirtle',
    data: [44, 48, 65, 43, 50],
    color: 'blue',
    hideMark: true,
  },
];

function Radar() {
  return (
    <RadarChart
      series={series}
      radar={{
        metrics: ['HP', 'Attack', 'Defense', 'Speed', 'Special'],
      }}
      sx={{ [`& .${radarSeriesPlotClasses.area}`]: { strokeWidth: 2 } }}
    />
  );
}

export default function RadarDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/radar/">
      <Stack sx={{ width: '100%', padding: 2 }} justifyContent="space-between">
        <Box
          sx={{
            height: 300,
            overflow: 'auto',
            minWidth: 260,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Radar />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`<RadarChart
  series={series}
  radar={{
    metrics: ['HP', 'Attack', 'Defense', 'Speed', 'Special'],
  }}
  sx={{[\`& .${radarSeriesPlotClasses.area}\`]: {strokeWidth: 2}}}
/>`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
