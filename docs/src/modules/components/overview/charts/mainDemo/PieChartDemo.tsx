/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import muiMaterialData from '../data/@mui-material.json';

interface MuiMaterialVersionEntry {
  date: string;
  '5'?: number;
  '6'?: number;
  '7'?: number;
  // Other keys may exist, but we only care about 5, 6, 7
}

const dataArray = muiMaterialData as MuiMaterialVersionEntry[];
const dateToShow = '2025-06-08';
const versionMap: Record<'5' | '6' | '7', string> = {
  '5': 'v5',
  '6': 'v6',
  '7': 'v7',
};

const dateEntry = dataArray.find((entry) => entry.date === dateToShow);
const data = dateEntry
  ? (Object.keys(versionMap) as Array<keyof typeof versionMap>).map((key) => ({
      label: versionMap[key],
      value: dateEntry[key] ?? 0,
    }))
  : [];

export default function PieChartDemo() {
  return (
    <React.Fragment>
      <Typography>08-Jun-25 @mui/material split</Typography>
      <PieChart
        series={[
          {
            startAngle: -90,
            endAngle: 90,
            data,
            innerRadius: '150%',
            outerRadius: '200%',
            cy: '100%',
          },
        ]}
        sx={{ aspectRatio: 2 }}
        height={100}
        margin={5}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          },
        }}
      />
    </React.Fragment>
  );
}
