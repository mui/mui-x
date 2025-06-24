import * as React from 'react';
import { RadarSeriesType } from '@mui/x-charts/models';
import { RadarChart, radarSeriesPlotClasses } from '@mui/x-charts/RadarChart';
import ChartDemoWrapper from '../ChartDemoWrapper';
import Typography from '@mui/material/Typography';

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
    <React.Fragment>
      <Typography align="center">Pokémon base stats</Typography>
      <RadarChart
        series={series}
        radar={{
          metrics: ['HP', 'Attack', 'Defense', 'Speed', 'Special'],
        }}
        sx={{ [`& .${radarSeriesPlotClasses.area}`]: { strokeWidth: 2 } }}
      />
    </React.Fragment>
  );
}

export default function RadarDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/radar/">
      <Radar />
    </ChartDemoWrapper>
  );
}
