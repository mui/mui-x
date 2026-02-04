import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

const clubs = [
  'Arsenal',
  'Liverpool',
  'Man Utd',
  'Tottenham',
  'Everton',
  'Sunderland',
  'Newcastle',
  'Nottingham Forest',
  'Leeds',
  'Man City',
  'West Ham',
  'Burnley',
  'Fulham',
  'Chelsea',
  'Aston Villa',
  'Wolves',
  'Crystal Palace',
  'Brentford',
  'Bournemouth',
  'Brighton',
];

// Source: https://www.squawka.com/en/news/premier-league-net-spend-2025-26/
const netSpendInPounds = [
  251.4, 235, 166.9, 137.8, 116, 113.4, 95.6, 95.4, 91.5, 80.2, 69.7, 57.8, 18.93,
  9.5, -8, -14.7, -23, -58.9, -63.3, -68.15,
];

const clubColors = [
  '#EF0107', // Arsenal - Red
  '#C8102E', // Liverpool - Red
  '#DA291C', // Man Utd - Red
  '#132257', // Tottenham - Navy Blue
  '#003399', // Everton - Royal Blue
  '#E03A3E', // Sunderland - Red
  '#241F20', // Newcastle - Black
  '#DD0000', // Nottingham Forest - Red
  '#FFCD00', // Leeds - Yellow
  '#6CABDD', // Man City - Sky Blue
  '#7A263A', // West Ham - Claret
  '#6C1D45', // Burnley - Claret
  '#CC0000', // Fulham - Red
  '#034694', // Chelsea - Blue
  '#670E36', // Aston Villa - Claret
  '#FDB913', // Wolves - Gold
  '#1B458F', // Crystal Palace - Blue
  '#E30613', // Brentford - Red
  '#DA291C', // Bournemouth - Red
  '#0057B8', // Brighton - Blue
];

const valueFormatter = (v) => (v < 0 ? `-£${-v}m` : `£${v}m`);

const chartsParams = {
  margin: { top: 20, right: 40, bottom: 20, left: 20 },
  xAxis: [{ data: clubs, tickLabelStyle: { angle: 45 }, height: 80 }],
  yAxis: [
    {
      width: 60,
      valueFormatter,
    },
  ],
  series: [
    {
      data: netSpendInPounds,
      colorGetter: (data) => clubColors[data.dataIndex],
      valueFormatter,
    },
  ],
  height: 400,
};

export default function ColorCallback() {
  return (
    <Stack spacing={2} width="100%">
      <Typography variant="h6" textAlign="center">
        Premier League Clubs Net Spend - Summer 2025
      </Typography>
      <BarChart {...chartsParams} />
      <Typography variant="caption">Source: squawka.com</Typography>
    </Stack>
  );
}
